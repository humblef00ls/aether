<script>
  

	import { onMount } from 'svelte';
	import { fly } from "svelte/transition";

	import { prices } from './_stores';
	const currencies = ["BTC","ETH","LTC","XRP"]
	let start = false
	onMount(()=>{
		start = true
	})
  </script>
  <div class="bg">
	{#if start}
	<svg in:fly={{duration:1000,x:-100}} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 79 116"><defs></defs><polygon class="cls-1" points="19 116 49 0 30 0 0 116 19 116"/><polygon class="cls-2" points="60 116 30 0 49 0 79 116 60 116"/></svg>
	{/if}
</div>
  <div class="bar">
	{#each currencies as c}
	  <span>
		{c} {#if $prices[c]} ${$prices[c]} {/if}
	  </span>
	{/each}
  </div>

  <br>
 
	<h1>Aether</h1>
<div class="inputs">
	<a href="/login?signup=1"> 
		<button class="btn">Sign Up </button>
	</a>

	or

	<a href="/login">Login </a>
</div>
{#if start}
  <p in:fly={{duration:700,y:50}}>
	  Aether is a state of the art crypto currency exchange where you can make 💰 , or follow people who do. Yes, thats right! Aether is also a social media platform,
	  allowing you to share your gains with everyone!
  </p>
{/if}
  <style>
	  .cls-1{fill:#fff;}.cls-2{fill:#2e6eff;}
	  .bg{
		  position: fixed;
		  top: 0px;
		  left: 0px;
		  height: 100vh;
		  width: 100vw;
		  max-height: 100vw;
		  max-width: 100vh;
		  z-index: -1;
		  opacity: .3;
	  }
	
  .bar{
	background-color: #2A2A2A;
	color: white;
	height: 50px;
	display: flex;
	align-items: center;
	padding:5px;
	justify-content: space-around;
  }
  
  h1 {

	display: flex;
	align-items: center;
	margin-top: 50px;
	justify-content: space-around;
	font-size: 200px;
  }
  
  :global(.btn) {
		background: none;
		color: inherit;
		border: none;
		padding: 10px;
		padding-right: 15px;
		padding-left: 15px;
		font: inherit;
		cursor: pointer;
		border-radius: 50px;
		outline: inherit;
		transition-duration: .5s;
		background-color: #2E6EFF;
		color: white;
	}


	:global(.btn:hover) {
		background-color: #265cdb;
	}

	.inputs{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.inputs  button {
		margin-bottom: 15px;
		font-size: 1.5em;
		padding: 25px;
		letter-spacing: 2px;
		text-align: center;
		width: 300px;

	}
	.inputs > a {
		margin-top: 5px;
	}
	a{
		text-decoration: none;
		color: #2E6EFF;
	}
	p{
		padding: 25px;
		font-size: 1.2em;
		line-height: 1.5em;
		padding-left: 50px;
		padding-right: 50px;
		margin:50px;
		margin-left: 100px;
		margin-right: 100px;
		text-align: center;
		background-color: white;
		color: black;
		border-radius: 20px;
	}
  </style>