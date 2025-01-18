<script lang="ts">
	import { countries, format, getDuration, haversineDistance } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Float from '$lib/components/Float.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { log, aircraft, ref } = data;

	const depTime = log.dep_time;
	const desTime = log.des_time;
	const distance =
		haversineDistance(
			{ longitude: log.dep_airport.longitude, latitude: log.dep_airport.latitude },
			{ longitude: log.des_airport.longitude, latitude: log.des_airport.latitude }
		) / 1.852;
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

	function getOpenStreetMap(airport: Airport) {
		// Extract longitude and latitude from the airport object
		const longitude = airport.longitude;
		const latitude = airport.latitude;
		// Calculate a degree offset for a 30km radius around the point
		// 1 degree of latitude is approximately 111.32 km
		const degrees = Math.min(distance + 20, 1000) / 111.32;
		// Create a bounding box (bbox) around the airport location
		// The bbox defines the map's visible area, extending 30km in each direction
		const bbox = [
			longitude - degrees, // Western boundary (longitude - 30km in degrees)
			latitude - degrees, // Southern boundary (latitude - 30km in degrees)
			longitude + degrees, // Eastern boundary (longitude + 30km in degrees)
			latitude + degrees // Northern boundary (latitude + 30km in degrees)
		].join(','); // Convert the bbox array to a comma-separated string
		// Create a marker string using the airport's latitude and longitude
		// This marker will indicate the airport's exact location on the map
		const marker = `${latitude},${longitude}`;
		// Construct the embed link for OpenStreetMap
		// The 'bbox' defines the visible area, and the 'marker' pinpoints the airport's location
		const embedLink = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&marker=${marker}`;
		return embedLink;
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
		<LogViewerCard title="Basic Info">
			<div class="prose">
				<ul>
					<li>Pilot in Command: {log.pilot_in_command}</li>
					<li>Duration: {getDuration(depTime, desTime)}</li>
					<li>Distance: {Math.round(distance).toLocaleString()}NM</li>
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
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Weather Details">
			<div class="prose">
				<ul>
					{@render weatherDetails(log.dep_weather, log.dep_airport.city)}
					{@render weatherDetails(log.des_weather, log.des_airport.city)}
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
			</LogViewerCard>
		{:else}
			<LogViewerCard title="Private Aircraft">This aircraft is private</LogViewerCard>
		{/if}
	</div>
</Container>
<div class="">
	<Container>
		<div class="grid gap-4 lg:grid-cols-2">
			{@render airportDetails(log.dep_airport)}
			{#if log.dep_airport.icao !== log.des_airport.icao}
				{@render airportDetails(log.des_airport)}
			{/if}
		</div>
	</Container>
</div>

{#if ref.length > 0}
	<Float>
		<a href={ref} aria-label="Back" class="btn shadow"><i class="fa-solid fa-arrow-left"></i></a>
	</Float>
{/if}

<Title title="Log Viewer"></Title>

{#snippet airportDetails(airport: Airport)}
	<div class="col-auto flex justify-around gap-4">
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
				<li>{`Region: ${airport.region}`}</li>
				<li>{`Country: ${countries[airport.country]}`}</li>
				<li>{`Timezone: ${airport.timezone}`}</li>
				<li>{`Elevation: ${parseInt(airport.elevation_ft).toLocaleString()}ft`}</li>
			</ul>
		</div>
		<iframe src={getOpenStreetMap(airport)} title={airport.name} frameborder="0"></iframe>
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
			<li>Pressure: {weather.pressure}</li>
			<li>Visibility: {weather.visibility.toLocaleString()} Meters</li>
			<li>Cloud Cover: {weather.cloud_cover}/100</li>
			<li>Precipation: {weather.precipation.toLocaleString()}ml</li>
		</ul>
	</li>
{/snippet}
