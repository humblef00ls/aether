<script>

	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { user,prices,userName } from './_stores';
	import Leftbar from './../components/Leftbar.svelte'
	onMount(async () => {
		getUser()
		getPrices()

	
	});
	
	async function getUser(){
        firebase.auth().onIdTokenChanged(async (u) => {
            try {
                if (!u) {
                    console.log('User Not Found')
                    $user = false;
                    return;
                }
				console.log('User Found,', u.uid)
				$user = u.uid
				await firebase.database().ref('/uids/' + $user).once('value').then(function(snapshot) {
					$userName = snapshot.val(); 
				});

				console.log($userName)

            } catch (e) {
                console.log(e);
                $user = false;
                return;
            }
		});
	}
	async function getPrices(){
		const currencies = ["bitcoin","ethereum","chainlink","litecoin","ripple","dogecoin","bitcoin-cash","binancecoin"]

      	let request = fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(currencies.join(','))}&vs_currencies=USD`) 
        const res = await (await request).json();
       	$prices = {
			BTC : res.bitcoin.usd,
			ETH: res.ethereum.usd,
			LINK : res.chainlink.usd,
			LTC: res.litecoin.usd,
			XRP : res.ripple.usd,
			DOGE :res.dogecoin.usd,
			BCH : res['bitcoin-cash'].usd,
			BNB : res.binancecoin.usd
		}
		console.log($prices)
	}
</script>



<main>
<Leftbar />
<section>
	<slot></slot>
</section>
</main>


<style>
main{
  	display: grid;
    grid-auto-flow: column;
    grid-template-columns: 80px 1fr;
    background-color: #121212;
    color: white;
	width: 100vw;
	max-width: 100vw;
    height:100vh
}
section{
	z-index: 1;
    position: relative;
}
</style>