<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Logbook from '$lib/components/Logbook.svelte';
	import Container from '$lib/components/Container.svelte';

	const { data } = $props();
	const { profile, aircrafts, supabase, logs } = data;
</script>

<Title title="Logbook"></Title>

<Container>
	<Logbook originalLogs={logs} {aircrafts} {supabase} {profile}></Logbook>
</Container>
