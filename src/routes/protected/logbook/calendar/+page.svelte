<script lang="ts">
	import { addParams, hrefs } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { page } from '$app/stores';

	const { data } = $props();
	const { logs } = data;
	let current: SvelteDate = $state(new SvelteDate());

	function change(dir: 'next' | ' previous'): void {
		const change: number = dir === 'next' ? 1 : -1;
		current.setMonth(current.getMonth() + change);
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
	function formatLog(log: Log) {
		return `${log.dep_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })}: ${log.dep_airport.icao} TO ${log.des_airport.icao}`;
	}
</script>

<Container>
	<div class="mb-2 flex items-center gap-2 border-b-2 pb-2">
		<div class="join">
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
	<div class=" grid grid-cols-3 gap-1 md:grid-cols-7">
		{#each { length: getDaysInMonth(current) } as _, index}
			{@render box(index + 1)}
		{/each}
	</div>
</Container>

{#snippet box(day: number)}
	<div class=" col-auto h-32 overflow-auto border transition hover:shadow">
		<div class="sticky top-0 bg-base-100">
			<h2 class="text-lg">{day}</h2>
		</div>
		<div class="flex flex-col gap-1">
			{#each logs.filter((item) => filterLogsDate(item, day)) as log}
				<a
					href={addParams(
						hrefs.logView.replace('slug', log.id.toString()),
						{
							ref: $page.url.toString()
						},
						$page.url.origin
					)}
					class="bg-base-200"
				>
					<span>{formatLog(log)} </span>
				</a>
			{/each}
		</div>
	</div>
{/snippet}

<Title title="Calendar"></Title>
