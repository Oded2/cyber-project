<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Container from '$lib/components/Container.svelte';
	import Logbook from '$lib/components/Logbook.svelte';

	const { data } = $props();
	const { profile, aircrafts, supabase, logs } = data;
</script>

<Title title="Logbook"></Title>

<Container>
	<Logbook {logs} {aircrafts} title={`Welcome back, ${profile.display}`} edit {supabase}></Logbook>
</Container>
