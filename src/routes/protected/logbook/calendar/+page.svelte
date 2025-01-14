<script lang="ts">
	import { addParams, formatDateTime, hrefs, maxDate, minDate, showModal } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { page } from '$app/stores';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import LogOptionsModal from '$lib/components/LogOptionsModal.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { logs: originalLogs, supabase } = data;
	let { logs } = $state(data);

	let currentLog: Log = $state(originalLogs[0]);

	const pageUrl = $page.url;

	let current: SvelteDate = new SvelteDate();
	current.setDate(1);

	// Variable that allows the user to log a flight by clicking on the calendar
	let datePicked: SvelteDate = new SvelteDate();
	// Same purpose as datePicked, but for log Id

	// Logs come in an order from latest to oldest, therefore they need to be reversed so they will show in oldest to latest
	// inside each calendar block
	onMount(() => {
		logs.reverse();
	});

	function change(dir: 'next' | ' previous'): void {
		const change: number = dir === 'next' ? 1 : -1;
		current.setMonth(current.getMonth() + change);
	}
	function resetDate(): void {
		const today = new Date();
		current.setFullYear(today.getFullYear());
		current.setMonth(today.getMonth());
		current.setDate(today.getDate());
	}
	function getDaysInMonth(date: SvelteDate): number {
		// The purpose of this function is to return the days in a month, with accounting for February 29th
		// Create a date object set to the 0th day of the next month
		const tempDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
		// Return the day of the month, which represents the number of days in the target month
		return tempDate.getDate();
	}
	function filterLogsDate(log: Log, day: number): boolean {
		// Accepts the day of the month and returns wether or not a log happened on that day
		const depTime = log.dep_time;
		return (
			depTime.getFullYear() == current.getFullYear() &&
			depTime.getMonth() == current.getMonth() &&
			depTime.getDate() == day
		);
	}
	function getExactDate(day: number): Date {
		// Accepts the current day and returns the exact date based on current
		// Useful for the calendar
		const newDate = new Date(current.getTime());
		newDate.setDate(day);
		return newDate;
	}
	function formatLog(log: Log) {
		return `${log.dep_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })}: ${log.dep_airport.icao} TO ${log.des_airport.icao}`;
	}
	function handleNewLog(date: number): void {
		datePicked.setFullYear(current.getFullYear());
		datePicked.setMonth(current.getMonth());
		datePicked.setDate(date);
		datePicked.setHours(0);
		datePicked.setMinutes(0);
		showModal('newLog');
	}
	function handleDelete() {
		logs = logs.filter((obj) => obj.id != currentLog.id);
	}
</script>

<Container>
	<div class="mb-2 flex items-center gap-2 border-b-2 pb-2">
		<div class="join">
			<a href={hrefs.logbook} class="btn join-item" aria-label="Logbook"
				><i class="fa-solid fa-book"></i></a
			>
			<button onclick={resetDate} class="btn join-item" aria-label="Reset"
				><i class="fa-solid fa-clock-rotate-left"></i></button
			>
			<button onclick={() => change(' previous')} class="btn join-item" aria-label="Previous month"
				><i class="fa-solid fa-caret-left"></i></button
			><button onclick={() => change('next')} class="btn join-item" aria-label="Next month"
				><i class="fa-solid fa-caret-right"></i></button
			>
		</div>
		<h1 class="text-xl font-bold">
			{current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
		</h1>
	</div>
	<div class="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-7">
		{#each { length: getDaysInMonth(current) } as _, index}
			{@render box(index + 1)}
		{/each}
	</div>
</Container>

{#snippet box(day: number)}
	<div class="col-auto border">
		<h2 class="text-lg">{day}</h2>
		<div class="h-24 overflow-auto">
			<div class="flex h-full flex-col gap-1">
				<!-- Filter all of the logs that much that specific day -->
				{#each logs.filter((item) => filterLogsDate(item, day)) as log}
					<button
						onclick={() => {
							currentLog = log;
							showModal('logOptions');
						}}
						class="bg-base-200 text-start transition hover:shadow-md"
					>
						<span>{formatLog(log)} </span>
					</button>
				{/each}
				{#if getExactDate(day).getTime() <= maxDate.getTime() && getExactDate(day).getTime() >= minDate.getTime()}
					<button onclick={() => handleNewLog(day)} class="h-full" aria-label="New Log"></button>
				{/if}
			</div>
		</div>
	</div>
{/snippet}

<LogOptionsModal id="logOptions" bind:log={currentLog} ondelete={handleDelete} {supabase}
></LogOptionsModal>

<ConfirmationModal
	id="newLog"
	title={`Would you like to create a log entry for ${datePicked.toLocaleString('en-US', { month: 'long', day: 'numeric' })}?`}
	href={addParams(hrefs.log, { date: formatDateTime(datePicked) }, pageUrl.origin)}
></ConfirmationModal>

<Title title="Calendar"></Title>
