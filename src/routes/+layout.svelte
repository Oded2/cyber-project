<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { defaultProfilePicture, hrefs } from '$lib';

	const { children, data } = $props();
	// possible issue
	const { supabase, session, user, profile } = data;

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				// TODO: Explain this
				invalidate('supabase:auth');
			}
			if (event === 'SIGNED_OUT') window.location.href = hrefs.home;
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Navbar
	profileImage={profile.image.length > 0 ? profile.image : defaultProfilePicture}
	loggedIn={user ? true : false}
	signOut={async () => {
		const { error: e } = await supabase.auth.signOut();
		if (e) error(e.status ?? 400, { message: e.message });
	}}
></Navbar>

{@render children()}
