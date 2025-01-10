<script lang="ts">
	import { flip } from 'svelte/animate';
	import { showModal } from '$lib';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import LogEntry from '$lib/components/LogEntry.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { profile, aircrafts, supabase } = data;
	let { logs } = $state(data);

	let toDelete: number = 0;

	async function handleDelete() {
		const { error: e } = await supabase.from('logs').delete().eq('id', toDelete);
		if (e) {
			alert(`Error: ${e.message}`);
			return;
		}
		logs = logs.filter((obj) => obj.id != toDelete);
	}
</script>

<Title title="Logbook"></Title>

<Container>
	<h1 class="text-xl font-bold">Welcome back, {profile.display}</h1>
	<div class="my-2 flex border p-2"></div>
	<div class="mt-5 flex w-full flex-col">
		<div class="grid grid-cols-6 border-b-2 px-3 pb-2">
			<div class="col-auto">Log</div>
			<div class="col-auto">Duration</div>
			<div class="col-auto">Aircraft</div>
			<div class="col-auto">Rating</div>
			<div class="col-auto">Pilot in Command</div>
			<div class="col-auto">Options</div>
		</div>
		{#each logs as log, index (log)}
			<div animate:flip={{ duration: 500 }}>
				<LogEntry
					ondelete={() => {
						toDelete = log.id;
						showModal('delete');
					}}
					{aircrafts}
					shade={index % 2 != 0}
					{log}
				></LogEntry>
			</div>
		{/each}
	</div>
</Container>

<ConfirmationModal id="delete" onconfirmation={handleDelete}></ConfirmationModal>
