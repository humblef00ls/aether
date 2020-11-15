<script>

  
    import { onMount } from 'svelte';
    import { goto } from '@sapper/app';
    import { user, userName } from './_stores';
    import { prices } from './_stores';



    let balance;
          let numbers = 1;
          let yes = false;
          let questions = [
            { id: 1, text: `Buy` },
            { id: 2, text: `Sell` },
        ];
        let currencies = ["BTC","ETH","LINK","LTC","XRP","DOGE","BCH","BNB"]
        let selected = 	questions[0];
        let selectedc = currencies[0];
      
        let holdings 
        $: console.log(holdings)
        onMount(async ()=>{
              if ($user) {
                await firebase.firestore().collection("users").doc($user)
                    .get()
                    .then(doc =>{
                        if (doc.exists) {
                            console.log(doc.data())
                            balance = doc.data().balance;
                            holdings = doc.data().portfolio
                        } 
                        else {
                            goto('/login')
                            console.log("No such document!");
                        }
                }).catch(function(error) {
                    goto('l/ogin')
                    console.log("Error getting document:", error);
                });
              } else {
                  setTimeout(()=>{
                    if (!$user ) goto('/login')
                    else {
                        firebase.firestore().collection("users").doc($user)
                    .get()
                    .then(doc =>{
                        if (doc.exists) {
                            balance = doc.data().balance;
                            holdings = doc.data().portfolio;
                            regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
                        } 
                        else {
                            goto('/login')
                            console.log("No such document!");
                        }
                }).catch(function(error) {
                    goto('l/ogin')
                    console.log("Error getting document:", error);
                });
                    }
                  },3000)
              }
        });
        
    function addNumber() {
        balance += total;
        var sfDocRef = firebase.firestore().collection("users").doc($user);
        return firebase.firestore().runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
            var newBalance = sfDoc.data().balance + total;
            let newval = sfDoc.data().portfolio;
            if(newval[selectedc]===undefined)
                return Promise.reject("You do not hold enough of this currency");
            else
                newval[selectedc]-= numbers

            if (newval[selectedc] >= 0) {
                transaction.update(sfDocRef, { 
                    balance: newBalance,
                    portfolio: newval
                });
                firebase.firestore().collection("transaction").doc().set({
                    amount: numbers,
                    caption:commtext,
                    comment_count:0,
                    like_count:0,
                    stock:selectedc,
                    time: firebase.firestore.FieldValue.serverTimestamp(),
                    type: 'sell',
                    uid : $user

                });

                return newBalance;
            } else {
                return Promise.reject("You do not hold enough of this currency");
            }
        });
    
        }).then(function() {
            alert("Transaction successfully committed!");
        }).catch(function(error) {
            alert( error);
        });
        }
    
    function subNumber() {
        if(balance - total >= 0){
            balance -= total;
        }
        var sfDocRef = firebase.firestore().collection("users").doc($user);
    
        return firebase.firestore().runTransaction(function(transaction) {
        return transaction.get(sfDocRef).then(function(sfDoc) {
            if (!sfDoc.exists) {
                throw "Document does not exist!";
            }
    
            var newBalance = sfDoc.data().balance - total;
            let newval = sfDoc.data().portfolio;
            if(newval[selectedc]===undefined)
                newval[selectedc] = numbers
            else
                newval[selectedc]+= numbers
            
                console.log(newval)
            if (newBalance >= 0) {
                transaction.update(sfDocRef, { 
                    balance: newBalance,
                    portfolio: newval
                });
              firebase.firestore().collection("transaction").doc().set({
                    amount: numbers,
                    caption:commtext,
                    comment_count:0,
                    like_count:0,
                    stock:selectedc,
                    time: firebase.firestore.FieldValue.serverTimestamp(),
                    type: 'buy',
                    uid : $user

                });
                return  
            } else {
                return Promise.reject("Transaction failed: Not Enough balance!");
            }
        });
    
        }).then(function() {
        alert("Transaction successfully committed!");
        }).catch(function(error) {
        alert(error);
        });
        }
    
        let total
        $: total  = Math.floor(($prices[selectedc]* numbers) * 100)/100
        let commtext
    </script>
    
    <style>
    
        .center{
            align-items: center;
            display: flex;
    justify-content: center;
    height: 100%;
    flex-direction: column;
        }
    
    h3{
        text-align: center;
        font-size: 2em;
    }
    
        /* Container to center page on a screen */
    
      main{
    
        height: 100%;
        width: 100%;
        grid-auto-flow: column;
    
        background-color: #121212;
        color: white;
        width: 100%;
      }
      button:focus,
    button:active,
    button:hover,
    input[type="number"]:focus,
    select
    {
        outline:0px !important;
        -webkit-appearance:none;
        box-shadow: none !important;
    }
    button ,input[type="number"]{
        background: none;
        color: inherit;
        border: none;
    
        font: inherit;
        cursor: pointer;
    
        outline: inherit;
        transition-duration: .5s;
        background-color: #2E6EFF;
        color: white;
    }
    input[type="number"]{
        background-color:rgb(77, 77, 77);
    }
    button,input,select{
        padding:10px;
        padding-left: 15px;
        padding-right: 15px;
        width: 300px;
        margin: 15px;
    }
    select{
        background: url('/chevron-down.svg') 96% / 15% no-repeat rgb(77, 77, 77);;
    }
    button:hover {
        background-color: #265cdb;
    }
    button:disabled{
        color: rgba(255,255,255,.4);
        background-color: #265cdb;
        cursor: not-allowed;
    }
    button{
        width: unset;
        border-radius: 50px;
        padding: 20px;
        width: 200px;
        text-align: center;

    }
    .inputs{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        min-width: 300px;
        width: 50%;
    }
    span{
        text-align: center;
    
    }
    textarea{
        height: 250px;
        width: 100%;
        padding:15px;
        margin-top: 15px;
        margin-bottom: 15px;
        background-color:rgb(77, 77, 77);
    color:white;
    box-sizing: border-box;
    font-family: inherit;
    font-size: 1em;
    }
    textarea:focus{
        
    outline:0px !important;
    -webkit-appearance:none;
    box-shadow: none !important;

    }
    </style>
    
    <main>
    
        <div class='center'>
            <h1> <title>Transaction</title> </h1>
            
                <h3> Current Balance: <br> {#if balance}${balance}{/if} </h3>
        
    
    <div class="inputs">
        <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value={selected} on:change="{() => numbers = ''}">
        {#each questions as question}
        <option value={question}>
          {question.text}
          </option>
        {/each}
        </select>
                <!-- svelte-ignore a11y-no-onchange -->
    <select bind:value={selectedc} on:change="{() => numbers = ''}">
        {#each currencies as c}
        <option value={c}>
          {c}
          </option>
        {/each}
        </select>
    <input type="number" bind:value={numbers} >
   <span>
       1 {selectedc}
       ${$prices[selectedc]} 
       <br>
       Total : ${total}
   </span>
   <textarea bind:value={commtext} placeholder="Post Description"></textarea>
    </div>
    

    {#if selected.id ==1}<button  class="btn" on:click|preventDefault={ subNumber}>BUY {numbers} of {selectedc}</button>
    {:else} <button class="btn" on:click|preventDefault={ addNumber }>SELL {numbers} of {selectedc}</button>
    {/if}
    
    </div>
    </main>