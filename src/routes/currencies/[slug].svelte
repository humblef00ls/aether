<script>

    import { stores } from "@sapper/app";
    import { onMount } from "svelte";
    import Trade from '../../components/Trade.svelte';
    import Leftbar from "../../components/Leftbar.svelte";
	  import { prices, user, userName } from './../_stores';
    const {page} = stores()

    export let falcon = false
    export let loggedIn = false
    let currentUser
    let currentUid

    $: if ($user) {
      loggedIn = true
    }


    const map = {
       'BTC':'Bitcoin',
       'XRP':'Ripple',
       'LTC':'Litecoin',
       'DOGE':'Dogecoin',
       'ETH':'Ethereum',
       'LINK':'Chainlink',
       'BCH':'Bitcoin Cash',
       'BNB':'Binance Coin'       
   }

    let trades = []
    let names = []

    async function getTrades() {
   // console.log(user.uid)
   trades = []
    await firebase.firestore().collection("transaction").where("stock", "==", slug.toUpperCase()).orderBy('time','desc').limit(5)
        .get()
        .then(snap=>{
            snap.forEach(doc=>{
                trades = [...trades,doc]
             console.log(doc.data())
             firebase.firestore().collection("users").where("uid", "==", doc.data()["uid"]).get().then(function(snap) {
              snap.forEach(function(item) {
                names = [...names, item.data().username]
            })
            });
            })
        })
  }

    const { slug } = $page.params;
    onMount(()=>{
        getTrades()
        new TradingView.widget(
    {
    "container_id": "technical-analysis",
    "width": (window.innerWidth/3) * 2,
    "height": 600,
    "symbol": `${slug}USD`,
    "interval": "D",
    "timezone": "exchange",
    "theme": "dark",
    "style": "1",
    "toolbar_bg": "#f1f3f6",
    "withdateranges": true,
    "hide_side_toolbar": true,
    "allow_symbol_change": true,
    "save_image": false,
    "studies": [
      "ROC@tv-basicstudies",
      "StochasticRSI@tv-basicstudies",
      "MASimple@tv-basicstudies"
    ],
    "show_popup_button": true,
    "popup_width": "1000",
    "popup_height": "650",
    "locale": "in"
    });
    })
</script>

<head>
  <title>Currency – {map[slug.toUpperCase()]}</title>
</head>
<!--Content goes here-->
<body>
<main>
  <div class = "content">
    <h1>{map[slug.toUpperCase()]}, {slug.toUpperCase()}</h1> 
    <h2 class = "header">${$prices[slug.toUpperCase()]}</h2>

    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container">
      <div id="technical-analysis"></div>
      <div class="tradingview-widget-copyright">by TradingView</div>
    </div>

    <!-- TradingView Widget END -->
    {#each trades as trade, index}
      <Trade tradefull={trade} {index} name = {names[index]}/>
    {/each}
  </div>
</main>
</body>

<style>
  /* Container to center page on a screen */
.content {
  padding: 40px;
  text-align: center;
}
.header {
  font-size: 30px;
  color:#65ACFF;
  text-align: center;
  font-family: inherit;
}
main{
  width: 90%;
  margin-left: 5%;
}
</style>