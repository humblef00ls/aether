import {writable} from "svelte/store";

export let user = writable(false);
export let userName = writable(false);
export let prices = writable({});