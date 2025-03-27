<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_MAP_ENDPOINT } from '$env/static/public';
	import { addParams, bannedCountries, countries, format, getDuration, hrefs } from '$lib';
	import { buildRoute, getCountriesFlownOver, haversineDistance } from '$lib/coordinates.js';
	import Container from '$lib/components/Container.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Ref from '$lib/components/Ref.svelte';
	import Title from '$lib/components/Title.svelte';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { log, aircraft, ref } = data;

	const pageUrl = page.url;
	const roundTrip = log.dep_airport.icao === log.des_airport.icao;
	const { dep_time: depTime, des_time: desTime, weather_data: weather } = log;
	const dep_weather = weather[0];
	const des_weather = weather[weather.length - 1];
	const start: Coordinate = [log.dep_airport.longitude, log.dep_airport.latitude];
	const end: Coordinate = [log.des_airport.longitude, log.des_airport.latitude];
	const distanceKm = haversineDistance(start, end);
	// TODO: Make banned countries specific to the owner of the log
	const routePromise = buildRoute(start, end, bannedCountries.IL);
	const countriesFlownPromise = getCountriesFlownOver(routePromise);
	let mapContainer: HTMLDivElement;

	onMount(() => {
		getRouteMap().then((mapContent) => {
			// Create an iframe to hold the map
			const iframe = document.createElement('iframe');
			iframe.style.border = 'none';
			// Set desired dimensions for the map
			iframe.style.width = '100%';
			iframe.style.height = '100%'; // adjust as needed
			// Append the iframe to the container
			mapContainer.appendChild(iframe);
			// Write the fetched HTML content into the iframe's document
			const doc = iframe.contentWindow?.document;
			if (doc) {
				doc.open();
				doc.write(mapContent);
				doc.close();
			}
		});
	});

	function formatSpecificDate(date: Date): string {
		return date.toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'long'
		});
	}
	function entryTime(date: Date): string {
		const formatter = new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric'
		});
		return formatter.format(date);
	}

	async function getRouteMap(): Promise<string> {
		// Prepare any data you need to send with your request.
		const weatherFiltered = weather.map(({ wind_speed, wind_direction, coord }) => ({
			wind_speed,
			wind_direction,
			coord
		}));
		const route = await routePromise;
		// Reverse the coordinates for the python code since they're reversed there
		const newRoute = route.map((val) => [val[1], val[0]]);
		console.log(newRoute[0]);
		// Make a POST request to the endpoint that returns the Folium map HTML
		const response = await fetch(PUBLIC_MAP_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				// Reverse the order if your endpoint expects [lat, lon] instead of [lon, lat]
				points: newRoute,
				dep: log.dep_airport.icao,
				des: log.des_airport.icao,
				weather_data: weatherFiltered
			})
		});
		// Return the full HTML string of the map
		const mapHTML = await response.text();
		return mapHTML;
	}
</script>

<Container>
	<div class="relative my-10 border-b-2">
		<h1 class="text-center text-xl">
			<span class="font-bold">{log.dep_airport.city}</span> <i class="fa-solid fa-arrow-right"></i>
			<span class="font-bold"> {log.des_airport.city}</span>
		</h1>
		<h2 class="text-center">{formatSpecificDate(depTime)}</h2>
	</div>
	<div class="mb-10 grid gap-4 lg:grid-cols-3">
		<LogViewerCard title="Basic Information">
			<div class="prose">
				<ul>
					<li>Pilot in Command: {log.pilot_in_command}</li>
					<li>Duration: {getDuration(depTime, desTime)}</li>
					<li>Distance: {Math.round(distanceKm / 1.852).toLocaleString()}NM</li>
					<li>
						<strong>Departure & Landing</strong>
						<ul>
							<li>Takeoff: {entryTime(depTime)}</li>
							<li>Landing: {entryTime(desTime)}</li>
						</ul>
					</li>
					{#if log.altitude}
						<li>Cruising Altitude: {log.altitude.toLocaleString()}ft</li>
					{/if}
					{#if log.fuel_usage}
						<li>Fuel Usage: {log.fuel_usage.toLocaleString()} Gallons</li>
					{/if}
					{#if log.notes.length > 0}
						<li>
							Notes: {log.notes}
						</li>
					{/if}
					<li>
						Visibility: {format(log.visibility)}
					</li>
					<li>
						Logged: {log.created_at.toLocaleString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
							hour: 'numeric',
							minute: 'numeric'
						})}
					</li>
					{#await countriesFlownPromise then countries}
						<li>
							<strong>Countries Flown Over</strong>
							<ul>
								{#each countries as country}
									<li>
										{country}
									</li>
								{/each}
							</ul>
						</li>
					{/await}
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Weather Details">
			<div class="prose">
				<ul>
					{@render weatherDetails(dep_weather, log.dep_airport.city)}
					{@render weatherDetails(des_weather, log.des_airport.city)}
				</ul>
			</div>
		</LogViewerCard>
		{#if aircraft}
			<LogViewerCard title="Aircraft" image={aircraft.image_url}>
				<div class="prose">
					<ul>
						<li>Nickname: {aircraft.nickname}</li>
						<li>Tail Number: {aircraft.tail_number}</li>
						<li>Model: {aircraft.model}</li>
						<li>Manufacturer: {aircraft.manufacturer}</li>
						<li>Category: {aircraft.category}</li>
						<li>Range: {aircraft.range.toLocaleString()}NM</li>
						<li>Fuel Capacity: {aircraft.fuel_capacity.toLocaleString()} Gallons</li>
						{#if aircraft.notes.length > 0}
							<li>Notes: {aircraft.notes}</li>
						{/if}
					</ul>
				</div>
				<a
					class="btn btn-outline btn-info me-auto"
					href={addParams(hrefs.aircraft.replace('slug', aircraft.id.toString()), {
						ref: pageUrl.toString()
					})}>View</a
				>
			</LogViewerCard>
		{:else}
			<LogViewerCard title="Private Aircraft">This aircraft is private</LogViewerCard>
		{/if}
	</div>
</Container>
<Container>
	<div class="flex flex-col gap-2 lg:flex-row">
		<div class="flex gap-2 lg:flex-col" class:justify-around={!roundTrip}>
			{@render airportDetails(log.dep_airport)}
			{#if !roundTrip}
				{@render airportDetails(log.des_airport)}
			{/if}
		</div>
		<div bind:this={mapContainer} class="flex w-full flex-col"></div>
	</div>
</Container>

<Ref {ref}></Ref>

<Title title="Log Viewer"></Title>

{#snippet airportDetails(airport: Airport)}
	<div
		class="flex flex-col justify-between gap-4 sm:flex-row"
		class:col-auto={!roundTrip}
		class:col-span-2={roundTrip}
	>
		<div class="prose">
			<strong class="text-lg">{airport.name}</strong>
			<ul>
				<li>
					{`ICAO: ${airport.icao}`}
				</li>
				{#if airport.iata.length > 0}
					<li>{`IATA: ${airport.iata}`}</li>
				{/if}
				<li>{`City: ${airport.city}`}</li>
				{#if airport.region.length > 0}
					<li>{`Region: ${airport.region}`}</li>
				{/if}
				<li>{`Country: ${countries[airport.country]}`}</li>
				<li>{`Timezone: ${airport.timezone}`}</li>
				<li>{`Elevation: ${parseInt(airport.elevation_ft).toLocaleString()}ft`}</li>
			</ul>
		</div>
	</div>
{/snippet}

{#snippet weatherDetails(weather: Weather, title: string)}
	<li>
		<strong>{title}</strong>
		<ul>
			<li>Wind: {weather.wind_direction}&deg;/{weather.wind_speed}KN</li>
			<li>Temperature: {weather.temperature.toLocaleString()}&deg;C</li>
			<li>Dew Point: {weather.dewPoint.toLocaleString()}&deg;C</li>
			<li>Relative Humidity: {weather.humidity}%</li>
			<li>Pressure: {weather.pressure} Millibars</li>
			<li>Visibility: {weather.visibility.toLocaleString()} Meters</li>
			<li>Cloud Cover: {weather.cloud_cover}/100</li>
			<li>Precipation: {weather.precipation.toLocaleString()}ml</li>
		</ul>
	</li>
{/snippet}
