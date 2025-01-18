<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import LogEntries from '$lib/components/LogEntries.svelte';
	import Container from '$lib/components/Container.svelte';

	const { data } = $props();
	const { profile, aircrafts, supabase, logs } = data;
</script>

<Title title="Logbook"></Title>

<Container>
	<LogEntries originalLogs={logs} {aircrafts} {supabase} title={`Welcome back, ${profile.display}`}
	></LogEntries>
</Container>
