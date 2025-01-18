<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import Logbook from '$lib/components/Logbook.svelte';

	const { data } = $props();
	const { logs, aircrafts, profile, supabase } = data;
</script>

<Container>
	<Logbook
		{logs}
		{aircrafts}
		title={`Welcome back, ${profile.display}`}
		defaultShowEntries={false}
		edit
		{supabase}
	></Logbook>
</Container>

<Title title="Calendar"></Title>
