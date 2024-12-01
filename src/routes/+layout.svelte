<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	let { children, data } = $props();
	// possible issue
	let { session, supabase } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});



	
</script>

<Navbar signIn={false}></Navbar>
{@render children()}
