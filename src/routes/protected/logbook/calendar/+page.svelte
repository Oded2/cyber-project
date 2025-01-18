<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import Logbook from '$lib/components/Logbook.svelte';

	const { data } = $props();
	const { logs, aircrafts, supabase } = data;
</script>

<Container>
	<Logbook {logs} {aircrafts} title="Your Calendar" defaultShowEntries={false} edit {supabase}
	></Logbook>
</Container>

<Title title="Calendar"></Title>
