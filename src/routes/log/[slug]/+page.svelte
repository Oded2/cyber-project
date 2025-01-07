<script lang="ts">
	import { getDuration, haversineDistance } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { log } = data;

	const depTime = log.dep_time;
	const desTime = log.des_time;
	console.log(typeof log.dep_airport.latitude);
	// const distance = haversineDistance(
	// 	{ longitude: log.dep_airport.longitude, latitude: log.dep_airport.latitude },
	// 	{ longitude: log.des_airport.longitude, latitude: log.des_airport.latitude }
	// );

	function formatSpecificDate(date: Date): string {
		const formatter = new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long'
		});
		return formatter.format(date);
	}
	function entryTime(date: Date): string {
		const formatter = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		});
		return formatter.format(date);
	}
</script>

<Container>
	<div class="my-10 border-b-2 text-center">
		<h1 class="text-xl">
			<span class="font-bold">{log.dep_airport.city}</span> <i class="fa-solid fa-arrow-right"></i>
			<span class="font-bold"> {log.des_airport.city}</span>
		</h1>
		<h2>{formatSpecificDate(depTime)}</h2>
	</div>
	<div class="mb-10 grid grid-cols-3">
		<LogViewerCard title="Basic Info">
			<div class="prose">
				<ul>
					<li>Pilot in Command: {log.pilot_in_command}</li>
					<li>Duration: {getDuration(depTime, desTime)}</li>
					<strong>Departure & Landing</strong>
					<ul>
						<li>Takeoff: {entryTime(depTime)}</li>
						<li>Landing: {entryTime(desTime)}</li>
					</ul>
					{#if log.altitude}
						<li>Cruising Altitude: {log.altitude}ft</li>
					{/if}
					{#if log.fuel_usage}
						<li>Fuel Usage: {log.fuel_usage} gallons</li>
					{/if}
				</ul>
			</div>
		</LogViewerCard>
	</div>
</Container>

<Title title="Log Viewer"></Title>
