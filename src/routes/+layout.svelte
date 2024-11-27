<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	let { children, data } = $props();

	const { signedIn } = data;
</script>

<Navbar signIn={signedIn}></Navbar>
{@render children()}
