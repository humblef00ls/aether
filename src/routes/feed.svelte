<script>
  import TransactionPost from '../components/TransactionPost.svelte';
  import { onMount } from 'svelte';
  import { goto } from '@sapper/app';
	import { user,userName } from './_stores';

  let loading = true;
  export var posts = [];
  export let followingIds = [];
  export let loggedIn = false
  let currentUser
  let currentUid

  $: if ($user) {
    loggedIn = true
    mount()
  } 

  onMount(async ()=>{
  		if (!$user) { 
				goto('/login')
  		}
  });
  
  async function mount() {
    await firebase.firestore().collection("users").where("username", "==", $userName)
        .get()
        .then(snap=>{
            snap.forEach(doc=>{
              if (doc.exists) {
                currentUser = new User(doc.data().uid, doc.data().username, doc.data().email, doc.data().balance, doc.data().picture,doc.data().bio)
					    } else {
						    goto('/login')
						    console.log("No such document!");
					    }
            })
        }).then(()=> {
            currentUid = $user
        })
        .then(() => {
          getData()
       })
  }

  class User {
    constructor (uid, username, email, balance, picture, bio) {
      this.uid = uid;
      this.username = username;
      this.balance = balance;
      this.email = email;
      this.picture = picture;
      this.bio = bio || ""
    }
  }

  function redirect() {
    goto('/login')
  }

  async function getData() {
    const db =  firebase.firestore();
    var userPosts = [];
    getFollowingUsers(db, currentUid).then(function() {
      if (followingIds.length > 0) {
        db.collection("transaction").where("uid", "in", followingIds).orderBy("time", "desc").limit(15).get().then(function(snap) {
          snap.forEach(function(item) {
            var transType = 'Bought';
            let transId = item.id;
            if (item.data().type == 'sell') {
              transType = 'Sold';
            }
            var date = item.data().time.toDate().toDateString();
            var time = item.data().time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            var user = getUserInfo(db, item.data().uid).then(function(user) {
              var crypto = getCryptoInfo(db, item.data().stock).then(function(crypto) {
                var like = getLikeStatus(db, currentUid, transId).then(function(like) {
                  var count = getLikeCount(db, transId).then(function(count) {
                    var comments = getComments(db, transId).then(function(comments) {
                      var commentsWithNames = getUsernames(db, comments).then(function(finalComments) {
                        var post = {username: user.uname,
                          transid: transId,
                          currentUid: currentUid,
                          amount: item.data().amount,
                          userLogo: user.picture,
                          type: transType,
                          date: item.data().time.toDate().toDateString(),
                          time: item.data().time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          crypto: crypto.name,
                          cryptoPicture: crypto.logo,
                          likeCount: count,
                          caption: item.data().caption,
                          likeStatus: like.status,
                          likeId: like.id,
                          comments: finalComments,
                          dateCompare: item.data().time.toDate()
                        }
                        userPosts = [...userPosts, post]
                        posts = [...userPosts];
                        loading = false
                      })
                    })
                  })
                })
              })
            })
          })
          posts.sort((a,b) => a.dateCompare <= b.dateCompare && a.dateCompare <= b.dateCompare);
          return userPosts
        })
      } else {
        loading = false
      }
    })
  }  

  async function getFollowingUsers(db, uid) {
    var following = await db.collection("follows").where("uidFollower", "==", uid).get().then(function(snap) {
        snap.forEach(function(item) {
          followingIds.push(item.data().uidFollowing);
          followingIds = followingIds;
        });
      }).catch(function(error) {
      console.log("Error getting documents: ", error);
    });
  }

  async function getUserInfo(db, uid){
    var user = await db.collection("users").where("uid", "==", uid).get().then(function(snap) {
      snap.forEach(function(item) {
        user = {uname: item.data().username, picture: item.data().picture}
      })
      return user;
    });
    return user;
  }

  async function getLikeCount(db, transid){
    var count = 0;
    var user = await db.collection("likes").where("transid", "==", transid).get().then(function(snap) {
      snap.forEach(function(item) {
        count += 1;
      })
    });
    return count;
  }

  async function getLikeStatus(db, uid, transid){
    var like;
    var user = await db.collection("likes").where("uid", "==", uid).where("transid", "==", transid).get().then(function(snap) {
      snap.forEach(function(item) {
        like = {
          id: item.id,
          status: true
        }
      })
    });
    if (like == null) {
        return {
          id: null,
          status: false
        }
    }
    return like;
  }

  async function getComments(db, transid){
    var comments = await db.collection("comments").where("transid", "==", transid).orderBy("time", "asc").limit(10).get().then(function(snap) {
      var commentList = [];
      snap.forEach(function(item) {
        var commentToAdd = {
          id: item.id,
          comment: item.data().comment,
          uid: item.data().uid,
          username: ""
        };
        commentList.push(commentToAdd);
        commentList = commentList;
      })
      return commentList
    }).catch(function(error) {
      console.log("Error getting documents: ", error);
    });
    return comments
  }

  async function getUsernames(db, comments) {
    for (var i = 0; i < comments.length; ++i) {
      var comment = comments[i];
      var uname = await db.collection("users").where("uid", "==", comment.uid).get().then(function(snap) {
        var name = "";
        snap.forEach(function(item) {
          name = item.data().username;
        })
        return name;
      })
      comment.username = uname;
      comments[i] = comment;
    }
    return comments
  }

  async function getCryptoInfo(db, stock_symbol) {
    var currency = await db.collection("cryptocurrency").where("stock_symbol", "==", stock_symbol).get().then(function(snap) {
      snap.forEach(function(item) {
        currency = {name: item.data().name, logo: item.data().logo}
      })
      return currency;
    });
    return currency;
  }

</script>

<head>
  <title>Feed</title>
</head>

<main>

  <div class = "posts">
  {#if loading}
    <div class = "loading"> Loading </div>
  {:else}
    {#if posts.length > 0}
        {#each posts as post}
          <TransactionPost username = {post.username} userLogo = {post.userLogo} cryptoLogo = {post.cryptoPicture}
                cryptoName = {post.crypto} transactionType = {post.type} transactionTime = {post.time} isLiked = {post.likeStatus}
                transactionDate = {post.date} transactionCaption = {post.caption} likeCount = {post.likeCount} amount = {post.amount}
                currentUid = {post.currentUid} transId = {post.transid} likeId = {post.likeId} comments = {post.comments}/>
          <br>
        {/each}
    {:else}
      <p>Your friends haven't made any transactions yet!</p>
    {/if}
  {/if}
  </div>
</main>

<style>
  main{

height: 100%;
overflow-y: auto;
    width: 89%;
    margin-left: 5%;
    max-width: calc(100vw - 85px);
  }
  .posts{
    position: relative;
    margin-top: 25px;
    border-radius: 25px 25px 0px 0px;
    display: flex;
    background-color: #2A2A2A;
    padding: 45px;
    flex-direction: column;
}

  .loading {
    text-align: center;
  }


</style>