<script lang="ts">
	import { flip } from 'svelte/animate';
	import { hrefs, showModal } from '$lib';
	import LogEntry from '$lib/components/LogEntry.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import LogOptionsModal from '$lib/components/LogOptionsModal.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';

	const {
		originalLogs,
		aircrafts,
		profile,
		supabase
	}: { originalLogs: Log[]; aircrafts: Aircraft[]; profile: Profile; supabase: SupabaseClient } =
		$props();

	let logs = $state(originalLogs);
	let currentLog = $state(originalLogs[0]);
	// Variable that's true if only favorites are shown and false if all logs are shown
	let onlyFavorites: boolean = $state(false);

	function handleDelete() {
		logs = logs.filter((obj) => obj.id != currentLog.id);
		// Remove it from the originalLogs as well
		const indexToRemove = originalLogs.findIndex((item) => item.id == currentLog.id);
		originalLogs.splice(indexToRemove, 1);
	}
	function filterFavorite(): void {
		// Toggle the filter
		onlyFavorites = !onlyFavorites;
		// To pass the filter, the log needs to either be favorited "obj.favorite" or onlyFavorites
		// has to be false "!onlyFavorites"
		logs = originalLogs.filter((obj) => obj.favorite || !onlyFavorites);
	}
</script>

<h1 class="border-b-2 pb-2 text-xl font-bold">Welcome back, {profile.display}</h1>
<div class="mb-2 flex gap-2 border-b-2 p-2">
	<div class="dropdown-start dropdown">
		<div role="button" tabindex="0" class="btn">Sort By</div>
		<Dropdown automaticClose>
			<li>
				<button onclick={() => logs.sort((a, b) => b.dep_time.getTime() - a.dep_time.getTime())}
					>Departure Date</button
				>
				<button onclick={() => logs.sort((a, b) => b.created_at.getTime() - a.created_at.getTime())}
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
	<button
		class="btn btn-info"
		class:btn-outline={!onlyFavorites}
		onclick={filterFavorite}
		aria-label="Favorites Only"><i class="fa-solid fa-star"></i></button
	>
</div>

<div class="mt-5 flex w-full flex-col">
	<div class="grid grid-cols-3 border-b-2 px-3 pb-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
		<div class="col-auto">Log</div>
		<div class="col-auto hidden md:block">Duration</div>
		<div class="col-auto hidden sm:block">Aircraft</div>
		<div class="col-auto hidden lg:block">Rating</div>
		<div class="col-auto hidden lg:block">Pilot in Command</div>
		<div class="col-auto">Options</div>
		<div class="col-auto">Date Logged</div>
	</div>
	{#each logs as log, index (log)}
		<div animate:flip={{ duration: 500 }}>
			<LogEntry
				onoptions={() => {
					currentLog = log;
					showModal('logOptions');
				}}
				{aircrafts}
				shade={index % 2 != 0}
				bind:log={logs[logs.findIndex((item) => item.id == log.id)]}
			></LogEntry>
		</div>
	{/each}
</div>

<LogOptionsModal id="logOptions" ondelete={handleDelete} bind:log={currentLog} {supabase}
></LogOptionsModal>
