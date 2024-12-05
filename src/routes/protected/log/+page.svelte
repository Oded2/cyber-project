<script lang="ts">
	import Container from '$lib/components/Container.svelte';

	const { data } = $props();
	const { profile } = data;
</script>

<main>
	<Container>
		<h1>Hello {data.profile.display}</h1>
		<h2>Log flight</h2>
	</Container>
</main>
