<script>


    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import { fly } from "svelte/transition";
    let currencies = []
    onMount(async ()=>{
      firebase.firestore().collection('cryptocurrency').get()
        .then(snap=>{
          snap.forEach(doc => {
            currencies = [...currencies, doc.data()]
            })
        })
    })

</script>

{#if currencies.length==0}
  Fetching...
{:else}
  <ul>
    {#each currencies as c}
      <a href={`currencies/${c.stock_symbol}`}>
      <li in:fly={{duration:400,x:-50}}>
        <div class="img" style={`background: url('${c.logo}');    
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;`} />
        <div class="name">
          <h2>{c.stock_symbol} | {c.name}</h2>
        </div>
      </li>
    </a>
    {/each}
  </ul>
{/if}


<style>
  a{
    color: white;
    text-decoration: none;
  }
    ul {
      list-style-type: none;
    margin-block-start: 0;
    margin-block-end: 0;
    display: flex;
    flex-direction: column;
    padding-inline-start: 0;
    position: relative;
    z-index: 3;
    padding: 25px;
    }
    .img{
        height: 75px;
        width: 75px;
        border-radius: 50%;
    }
    li{
      display: flex;
    margin: 25px;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 25px;
    padding: 25px;
    background-color: rgb(77,77,77);
      transition-duration: .5s;
      transform:  scale(1);
    }
    li:hover{
      transform:  scale(1.03);
    }
    .name{
      display: flex;
      justify-content: center;
      align-items:center;
      margin-left: 50px;
    }

</style>