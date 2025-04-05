<script lang="ts">
	import { getDuration, getTimeDifference, hrefs } from '$lib';

	const { logs, aircrafts }: { logs: Log[]; aircrafts: Aircraft[] } = $props();

	const longest = logs.reduce((max, current) => {
		const differenceMax = getTimeDifference(max.dep_time, max.des_time);
		const differenceCurrent = getTimeDifference(current.dep_time, current.des_time);
		return differenceCurrent > differenceMax ? current : max;
	});
	const shortest = logs.reduce((min, current) => {
		const differenceMin = getTimeDifference(min.dep_time, min.des_time);
		const differenceCurrent = getTimeDifference(current.dep_time, current.des_time);
		return differenceCurrent < differenceMin ? current : min;
	});
	let aircraftFrequency: number = $state(0);
	const mostFrequentAircraft = getMostFrequentAircraft();

	function getMostFrequentAircraft(): Aircraft | 'Unknown' {
		// Challenge
		const counter: { [key: number]: number } = {};
		for (const log of logs) {
			const aircraftId = log.aircraft;
			if (isNaN(counter[aircraftId])) counter[aircraftId] = 0;
			counter[aircraftId]++;
		}
		let max = {
			id: aircrafts[0].id,
			count: counter[aircrafts[0].id] ?? 0
		};
		for (let i = 1; i < aircrafts.length; i++) {
			const id = aircrafts[i].id;
			const count = counter[id];
			if (count > max.count) {
				max.id = id;
				max.count = count;
			}
		}
		aircraftFrequency = max.count;
		return aircrafts.find((item) => item.id == max.id) ?? 'Unknown';
	}
</script>

<div class="mt-10 grid grid-cols-3 gap-4">
	<div class="col-auto">
		{@render statCard('Longest Flight', longest)}
	</div>
	<div class="col-auto">
		{@render statCard('Shortest Flight', shortest)}
	</div>
	<div class="col-auto">
		<div class="card glass bg-neutral h-full">
			<div class="card-body text-neutral-content">
				<h2 class="card-title mb-2">Most Common Aircraft</h2>
				{#if mostFrequentAircraft !== 'Unknown'}
					<a
						href={hrefs.aircraft.replace('slug', mostFrequentAircraft.id.toString())}
						class="text-xl font-bold">{mostFrequentAircraft.nickname}</a
					>
					<h1 class="text-xl font-semibold">
						{`Flown ${aircraftFrequency.toLocaleString()} times`}
					</h1>
				{:else}
					<h1 class="text-xl font-bold">{mostFrequentAircraft}</h1>{/if}
			</div>
			{#if mostFrequentAircraft !== 'Unknown' && mostFrequentAircraft.image_url}
				<figure class="h-1/2">
					<img src={mostFrequentAircraft.image_url} alt={mostFrequentAircraft.nickname} />
				</figure>
			{/if}
		</div>
	</div>
</div>

{#snippet statCard(title: string, log: Log)}
	{@const aircraft = aircrafts.find((item) => item.id == log.aircraft)}
	<div class="card glass bg-primary h-full">
		<div class="card-body text-primary-content">
			<h2 class="card-title mb-2">{title}</h2>
			<h1 class="text-xl font-bold">{`${log.dep_airport.icao} TO ${log.dep_airport.icao}`}</h1>
			<h1 class="text-xl font-semibold">{getDuration(log.dep_time, log.des_time)}</h1>
			{#if aircraft}
				<h1 class="text-xl font-semibold">
					Aircraft: <a href={hrefs.aircraft.replace('slug', aircraft.id.toString())}
						>{aircraft.nickname}</a
					>
				</h1>
			{/if}
		</div>
		{#if aircraft && aircraft.image_url}
			<figure class="h-1/2">
				<img src={aircraft.image_url} alt={aircraft.nickname} />
			</figure>
		{/if}
	</div>
{/snippet}
