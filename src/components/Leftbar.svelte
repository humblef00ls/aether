

<script>

    import { user,userName } from "../routes/_stores";
    import { goto, stores} from '@sapper/app';
    import { onMount } from "svelte";
    const { page } = stores()

    let currentUser = false

    function logout(){
        if ($user) {
            firebase.auth().signOut()
                .then( res => {
                    goto('/');
                })
                .catch( e =>{
                    console.log(e);
                })
        }
    }
    function check() {
         if($page.path.split('/').length >= 3)
         currentUser = $page.path.split('/')[2] == $userName

    }

    $: $page.path, $userName, check()


</script>

<ul>
    {#if $user}
        <li>
            <a href="feed">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </a>
        </li>
    {:else}
        <li>
            <a href="/">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </a>
        </li>
    {/if}
    <li>
        <a href="popular">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
        </a>
    </li>
    <li>
        <a href="search">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </a>
    </li>
    {#if currentUser && $page.path.split('/')[1] == 'profile'}
        <li>
            <a href="balance">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-credit-card"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>    
            </a>
        </li>

    {:else}
        {#if $user}
            <li>
                <a href="profile">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>        </a>
            </li>
        {/if}
    {/if}
    <li>
        <a href="currencies">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>  
        </a>
    </li>
    {#if $user}
        <li>
            <b on:click={logout}>
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </b>
        </li>
    {:else}
        <li>
            <a href="login">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor"  stroke-linecap="round" stroke-linejoin="round" class="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>   </a>
        </li>
    {/if}
</ul>

<style>
    ul {
        list-style-type: none;
        margin-block-start: 0;
        margin-block-end: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-inline-start: 0;
        position: relative;
        z-index: 3;

    }
    li {
        margin-top: 25px;
        width: 34px;
    }
    li  svg {
        stroke-width: 1.5;
        color:#65ACFF;
        transition-duration: .3s;

    }
    li svg:hover{
        stroke-width: 2
    }
    b{
        cursor: pointer;
    }
</style>