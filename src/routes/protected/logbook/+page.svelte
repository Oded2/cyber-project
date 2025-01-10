<script lang="ts">
	import { flip } from 'svelte/animate';
	import { hrefs, showModal } from '$lib';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import LogEntry from '$lib/components/LogEntry.svelte';
	import Title from '$lib/components/Title.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';

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
	<h1 class="border-b-2 pb-2 text-xl font-bold">Welcome back, {profile.display}</h1>
	<div class="mb-2 flex gap-2 border-b-2 p-2">
		<div class="dropdown-start dropdown">
			<button class="btn">Sort By</button>
			<Dropdown automaticClose>
				<li>
					<button onclick={() => logs.sort((a, b) => b.dep_time.getTime() - a.dep_time.getTime())}
						>Departure Date</button
					>
					<button
						onclick={() => logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())}
						>Date Logged</button
					>
				</li>
			</Dropdown>
		</div>
		<button class="btn" onclick={() => logs.reverse()} aria-label="Reverse"
			><i class="fa-solid fa-arrow-right-arrow-left"></i></button
		>
		<a href={hrefs.calendar} aria-label="Calendar" class="btn"
			><i class="fa-solid fa-calendar-days"></i></a
		>
	</div>
	<div class="mt-5 flex w-full flex-col">
		<div class="grid grid-cols-7 border-b-2 px-3 pb-2">
			<div class="col-auto">Log</div>
			<div class="col-auto">Duration</div>
			<div class="col-auto">Aircraft</div>
			<div class="col-auto">Rating</div>
			<div class="col-auto">Pilot in Command</div>
			<div class="col-auto">Options</div>
			<div class="col-auto">Date Logged</div>
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
