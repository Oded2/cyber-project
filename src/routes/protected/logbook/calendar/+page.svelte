<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import Calendar from '$lib/components/Calendar.svelte';

	const { data } = $props();
	const { logs, supabase } = data;
</script>

<Container>
	<Calendar originalLogs={logs} {supabase}></Calendar>
</Container>

<Title title="Calendar"></Title>
