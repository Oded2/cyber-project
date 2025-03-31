<script lang="ts">
	import { flip } from 'svelte/animate';
	import { hrefs, showModal, formatDate, getDuration, addParams, flipConfig } from '$lib';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import LogOptionsModal from '$lib/components/LogOptionsModal.svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { page } from '$app/state';

	const {
		originalLogs,
		aircrafts,
		edit = false,
		supabase
	}: {
		originalLogs: Log[];
		aircrafts: Aircraft[];
		edit?: boolean;
		supabase: SupabaseClient;
	} = $props();

	const pageUrl = page.url;

	let logs = $state(originalLogs);
	let currentLog = $state(originalLogs[0]);
	// Variable that's true if only favorites are shown and false if all logs are shown
	let onlyFavorites: boolean = $state(false);

	function handleDelete() {
		logs = logs.filter((obj) => obj.id != currentLog.id);
	}
	function filterFavorite(): void {
		// Toggle the filter
		onlyFavorites = !onlyFavorites;
		// To pass the filter, the log needs to either be favorited "obj.favorite" or onlyFavorites
		// has to be false "!onlyFavorites"
		logs = originalLogs.filter((obj) => obj.favorite || !onlyFavorites);
	}
	function formatRating(rating: typeof currentLog.rating): string {
		if (rating === 'instrument') return 'IFR';
		return 'VFR';
	}
</script>

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
		<div animate:flip={flipConfig}>
			{@render entry(log, index % 2 != 0)}
		</div>
	{/each}
</div>

{#snippet entry(log: Log, shade: boolean)}
	{@const aircraft = aircrafts.find((item) => item.id == log.aircraft)}
	<div
		class="grid grid-cols-3 px-3 py-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7"
		class:bg-base-200={shade}
	>
		<div class="col-auto flex flex-col justify-center gap-1">
			<h2 class="font-bold">
				{#if log.favorite}
					<i class="fa-solid fa-star text-info"></i>
				{/if}
				{log.dep_airport.icao} TO {log.des_airport.icao}
			</h2>
			<h6 class="text-sm font-light">{formatDate(log.dep_time)}</h6>
		</div>
		<div class="col-auto hidden items-center md:flex">
			<h2>{getDuration(log.dep_time, log.des_time)}</h2>
		</div>
		<div class="col-auto hidden items-center sm:flex">
			{#if aircraft}
				<a
					class="link"
					href={addParams(hrefs.aircraft.replace('slug', aircraft.id.toString()), {
						ref: pageUrl.toString()
					})}>{aircraft.nickname}</a
				>
			{:else}
				<span>Unknown</span>
			{/if}
		</div>
		<div class="col-auto hidden items-center lg:flex">
			<h2>{formatRating(log.rating)}</h2>
		</div>
		<div class=" col-auto hidden items-center lg:flex"><h2>{log.pilot_in_command}</h2></div>
		<div class="col-auto flex items-center">
			{#if edit}
				<button
					onclick={() => {
						currentLog = log;
						showModal('logOptions');
					}}
					class="btn btn-info">Options</button
				>
			{:else}
				<a
					href={addParams(hrefs.logView.replace('slug', log.id.toString()), {
						ref: pageUrl.toString()
					})}
					class="btn btn-info">View</a
				>
			{/if}
		</div>
		<div class=" col-auto flex items-center">
			<span
				>{log.created_at.toLocaleString('en-US', {
					year: 'numeric',
					month: 'short',
					day: '2-digit',
					hour: 'numeric',
					minute: 'numeric'
				})}</span
			>
		</div>
	</div>
{/snippet}

{#if edit}
	<LogOptionsModal
		id="logOptions"
		ondelete={handleDelete}
		bind:log={currentLog}
		{originalLogs}
		{supabase}
	></LogOptionsModal>
{/if}
