<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import LogEntry from '$lib/components/LogEntry.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { logs, profile } = data;
</script>

<Title title="Logbook"></Title>

<Container>
	<div class="mt-10">
		<h1 class="text-xl font-bold">Welcome back, {profile.display}</h1>
	</div>
	<div class="mt-5 flex w-full flex-col">
		<div class="grid grid-cols-4 border-b-2 px-3 pb-2">
			<div class="col-auto">Airports</div>
			<div class="col-auto">Duration</div>
			<div class="col-auto">Column 3</div>
			<div class="col-auto">Column 4</div>
		</div>
		{#each logs as log, index}
			<LogEntry shade={index % 2 != 0} {log}></LogEntry>
		{/each}
	</div>
</Container>
