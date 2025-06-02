<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_MAP_ENDPOINT } from '$env/static/public';
	import { addParams, countries, format, getDuration, hrefs } from '$lib';
	import { getCountriesFlownOver, getRouteDistance } from '$lib/coordinates.js';
	import Container from '$lib/components/Container.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Ref from '$lib/components/Ref.svelte';
	import Title from '$lib/components/Title.svelte';
	import { onMount } from 'svelte';
	import type { Position } from 'geojson';

	const { data } = $props();
	const { log, aircraft, ref, profile } = data;

	const pageUrl = page.url;
	const roundTrip = log.dep_airport.icao_code === log.des_airport.icao_code;
	const { dep_time: depTime, des_time: desTime, weather_data: weather } = log;
	const dep_weather = weather && weather[0];
	const des_weather = weather && weather[weather.length - 1];
	const route = log.points;
	const countriesFlownPromise = getCountriesFlownOver(route);
	let mapContainer: HTMLDivElement;

	onMount(() => {
		getRouteMap().then((mapContent) => {
			// Create an iframe to hold the map
			const iframe = document.createElement('iframe');
			iframe.style.border = 'none';
			// Set desired dimensions for the map
			iframe.style.width = '100%';
			iframe.style.height = '100%'; // adjust as needed
			iframe.style.minHeight = '400px';
			// Attach the html to the iframe document
			iframe.srcdoc = mapContent;
			// Append the iframe to the container
			mapContainer.appendChild(iframe);
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
		const weatherFiltered =
			weather &&
			weather.map(({ wind_speed, wind_direction, coord }) => ({
				wind_speed,
				wind_direction,
				coord
			}));
		// Reverse the coordinates for the python code since they're reversed there
		const newRoute = route.map((val) => [val[1], val[0]]);
		// Make a POST request to the endpoint that returns the Folium map HTML
		const response = await fetch(PUBLIC_MAP_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				// Reverse the order because the endpoint expects [lat, lon] instead of [lon, lat]
				points: newRoute,
				dep: log.dep_airport.icao_code,
				des: log.des_airport.icao_code,
				weather_data: weatherFiltered
			})
		});
		// Return the full HTML string of the map
		const mapHTML = await response.text();
		return mapHTML;
	}

	function coordinateToString(coord: Position): string {
		const map = {
			latitude: ['N', 'S'],
			longitude: ['E', 'W']
		};
		const getCoord = (coord: number, coordType: keyof typeof map) => {
			const { floor, abs } = Math;
			const symbol = coord > 0 ? map[coordType][0] : map[coordType][1];
			coord = abs(coord);
			const degrees = floor(coord);
			const minutes = floor((coord - degrees) * 60);
			const seconds = floor((coord - degrees - minutes / 60) * 3600);
			return `${degrees}°${minutes}'${seconds}"${symbol}`;
		};
		return `${getCoord(coord[0], 'latitude')}, ${getCoord(coord[1], 'longitude')}`;
	}
</script>

<Container>
	<div class="relative my-10 border-b-2">
		<h1 class="text-center text-xl">
			<span class="font-bold">{log.dep_airport.municipality}</span>
			<i class="fa-solid fa-arrow-right"></i>
			<span class="font-bold"> {log.des_airport.municipality}</span>
		</h1>
		<h2 class="text-center">{formatSpecificDate(depTime)}</h2>
		<h3 class="text-center text-sm">
			Logged by: <a href={hrefs.profile.replace('slug', profile.username)} class="link"
				>{profile.display}</a
			>
		</h3>
	</div>
	<div class="mb-10 grid gap-4 lg:grid-cols-3">
		<LogViewerCard title="Basic Information">
			<div class="prose">
				<ul>
					<li>Pilot in Command: {log.pilot_in_command}</li>
					<li>Duration: {getDuration(depTime, desTime)}</li>
					<li>Distance: {Math.round(getRouteDistance(route)).toLocaleString()}NM</li>
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
					{#await countriesFlownPromise then countriesFlown}
						<li>
							<strong>Countries Flown Over</strong>
							<br />
							{[...countriesFlown]
								.map((countryTwoLetter) => countries[countryTwoLetter])
								.join(', ')}
						</li>
					{/await}
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Weather Details">
			{#if dep_weather && des_weather}
				<div class="prose">
					<ul>
						{@render weatherDetails(dep_weather, log.dep_airport.municipality)}
						{@render weatherDetails(des_weather, log.des_airport.municipality)}
					</ul>
				</div>
			{:else}
				<h3 class="italic">No weather data</h3>
			{/if}
		</LogViewerCard>
		{#if aircraft}
			<LogViewerCard title="Aircraft" image={aircraft.image_url}>
				<div class="prose">
					<ul>
						<li>{`Nickname: ${aircraft.nickname}`}</li>
						<li>{`Tail Number: ${aircraft.tail_number}`}</li>
						{#if aircraft.model}
							<li>{`Model: ${aircraft.model}`}</li>
						{/if}
						{#if aircraft.manufacturer}
							<li>{`Manufacturer: ${aircraft.manufacturer}`}</li>
						{/if}
						<li>{`Category: ${aircraft.category}`}</li>
						{#if aircraft.range}
							<li>{`Range: ${Number(aircraft.range).toLocaleString()} NM`}</li>
						{/if}
						{#if aircraft.fuel_capacity}
							<li>{`Fuel Capacity: ${Number(aircraft.fuel_capacity).toLocaleString()} Gallons`}</li>
						{/if}
						{#if aircraft.notes}
							<li>{`Notes: ${aircraft.notes}`}</li>
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
		<div bind:this={mapContainer} class="flex min-h-80 w-full flex-col"></div>
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
					{`ICAO: ${airport.icao_code}`}
				</li>
				{#if airport.iata_code.length > 0}
					<li>{`IATA: ${airport.icao_code}`}</li>
				{/if}
				<li>{`Municipality: ${airport.municipality}`}</li>
				<li>{`Country: ${countries[airport.iso_country]}`}</li>
				<li>{`Elevation: ${airport.elevation_ft.toLocaleString()}ft`}</li>
				<li>
					{`Coordinates: ${coordinateToString([airport.latitude_deg, airport.longitude_deg])}`}
				</li>
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
			<li>QNH: {(weather.pressure * 0.0295).toFixed(2)}</li>
			<li>Visibility: {weather.visibility.toLocaleString()} Meters</li>
			<!-- Cloud cover needs to be x/8 -->
			<li>Cloud Cover: {Math.round(weather.cloud_cover / 12.5)}/8</li>
			<li>Precipation: {weather.precipation.toLocaleString()}ml</li>
		</ul>
	</li>
{/snippet}
