<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { hrefs } from '$lib';
	import { page } from '$app/stores';
	let { children, data } = $props();
	// possible issue
	const { supabase, session, user } = data;
	const url = $page;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) invalidate('supabase:auth');
			if (event === 'SIGNED_OUT') window.location.href = hrefs.home;
		});

		return () => data.subscription.unsubscribe();
	});
</script>

{#if url.status == 200}
	<Navbar
		{user}
		on:click={async () => {
			console.log('here');
			const { error: e } = await supabase.auth.signOut();
			if (e) error(500, { message: e.message });
		}}
	></Navbar>
{/if}
{@render children()}
