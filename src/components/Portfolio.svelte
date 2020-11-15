<script>
    export let portfolio

    import { onMount } from "svelte";
    import { prices } from '../routes/_stores';
    let currencies = []
    let total = 0
    onMount(()=>{
        currencies = Object.keys(portfolio)
        for(let x = 0; x < currencies.length;x++){
            total += $prices[currencies[x]] * portfolio[currencies[x]]
        }
    })
     

    
</script>
<div>
    <h2>Total Value : <b>${total}</b> </h2>
    {#each currencies as c}
        <article>
      <h3> <b>{portfolio[c]}</b> of <b>{c}</b> ( <b>${Math.floor(($prices[c] * portfolio[c])*100)/100}</b> )</h3> 
        </article>
    {/each}
</div>

<style>
    div{
        width: 100%;
        padding: 35px;
        border-radius: 20px;
        background-color: #2a2a2a;
        margin-top: 25px;
    }
    article{
        color: black;
        background-color: white;
        border-radius: 20px;
        padding: 25px;
        padding-top: 10px;
        padding-bottom: 10px;

        margin-bottom: 20px;
    }
    b{
        color: #3895ff;
    }

</style>