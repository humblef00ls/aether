<script>

  
import { onMount } from 'svelte';
import { goto } from '@sapper/app';
import { user, userName } from './_stores';
import Feed from './feed.svelte';

let balance;
  	let numbers = 100;
  	let yes = false;
  	let questions = [
		{ id: 1, text: `Add Balance` },
		{ id: 2, text: `Withdraw balance` },
	];
	let selected = 	questions[0];
	let u;
let loading = true;

	onMount(async ()=>{
  		if ($user) {
			await firebase.firestore().collection("users").doc($user)
				.get()
				.then(doc =>{
    				if (doc.exists) {
						balance = doc.data().balance;
						loading = false
					} 
					else {
						goto('/login')
						console.log("No such document!");
					}
			}).catch(function(error) {
				goto('/login')
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
					} 
					else {
						goto('/login')
						console.log("No such document!");
					}
			}).catch(function(error) {
				goto('/login')
    			console.log("Error getting document:", error);
			});
				}
			  },3000)
  		}
	});
	
function addNumber() {
	balance += numbers;
	var sfDocRef = firebase.firestore().collection("users").doc($user);
	return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }
		var newBalance = sfDoc.data().balance + numbers;
		if (newBalance >= 0) {
            transaction.update(sfDocRef, { balance: newBalance });
            return newBalance;
        } else {
            return Promise.reject("Transaction failed: Not Enough balance!");
        }
    });

	}).then(function() {
    	alert("Transaction successfully committed!");
	}).catch(function(error) {
    	alert( error);
	});
    alert('Balance Added!');
	}

function subNumber() {
	if(balance - numbers >= 0){
		balance -= numbers;
	}
	var sfDocRef = firebase.firestore().collection("users").doc($user);

	return firebase.firestore().runTransaction(function(transaction) {
    return transaction.get(sfDocRef).then(function(sfDoc) {
        if (!sfDoc.exists) {
            throw "Document does not exist!";
        }

		var newBalance = sfDoc.data().balance - numbers;
		if (newBalance >= 0) {
            transaction.update(sfDocRef, { balance: newBalance });
            return newBalance;
        } else {
            return Promise.reject("Transaction failed: Not Enough balance!");
        }
    });

	}).then(function() {
    alert("Transaction successfully committed!");
	}).catch(function(error) {
    alert("Transaction failed: Not Enough balance!");
	});
	}



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
}
.inputs{
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>

<main>
{#if loading}
	Loading...
{:else}
	<div class='center'>
		<h1> <title>Balance</title> </h1>
		
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
<input type="number" bind:value={numbers} min=0 max=1000>
<input type="range" bind:value={numbers} min=0 max=1000>
<input type="checkbox" bind:checked={yes}> <h6>Check the box to continue.</h6>
</div>

{#if yes} <h3>Thank you. Click button to continue.</h3>
{:else} <h3>You must check box to continue.</h3>
{/if} 
{#if selected.id ==1}<button disabled={!yes} on:click|preventDefault={addNumber }>Add ${numbers} to balance</button>
{:else} <button disabled={!yes} on:click|preventDefault={subNumber }>Withdraw ${numbers} from balance</button>
{/if}

</div>
{/if}
</main>