<script lang="ts">
	import { format } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Logbook from '$lib/components/Logbook.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { aircraft, profile, logs, supabase } = data;
</script>

<Container>
	<h1 class="text-center text-3xl font-medium">
		Aircraft: <span class="italic">{aircraft.nickname}</span>
	</h1>
	<div class="mt-10 grid gap-4 lg:grid-cols-3">
		<LogViewerCard title="Basic Info" image={aircraft.image_url}>
			<div class="prose">
				<ul>
					<li>{`Tail Number: ${aircraft.tail_number}`}</li>
					<li>{`Model: ${aircraft.model}`}</li>
					<li>{`Manufacturer: ${aircraft.manufacturer}`}</li>
					<li>{`Year of Manufacture: ${aircraft.year_of_manufacture}`}</li>
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Technical Details">
			<div class="prose">
				<ul>
					<li>{`Aircraft Type: ${aircraft.aircraft_type}`}</li>
					<li>{`Category: ${aircraft.category}`}</li>
					<li>{`Engines: ${aircraft.number_of_engines.toLocaleString()}`}</li>
					<li>
						{`Maximum Takeoff Weight: ${aircraft.maximum_takeoff_weight.toLocaleString()}lbs`}
					</li>
					<li>{`Wingspan: ${aircraft.wingspan.toLocaleString()}ft`}</li>
					<li>{`Range: ${aircraft.range.toLocaleString()}NM`}</li>
					<li>{`Cruising Speed: ${aircraft.cruising_speed.toLocaleString()}KN`}</li>
					<li>{`Fuel Capacity: ${aircraft.fuel_capacity.toLocaleString()} Gallons`}</li>
					<li>{`Fuel Type: ${aircraft.fuel_type}`}</li>
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Miscellaneous">
			<div class="prose">
				<ul>
					<li>{`Owner: ${aircraft.owner_name}`}</li>
					<li>{`Seating Capacity: ${aircraft.seating_capacity}`}</li>
					<li>{`Visibility: ${format(aircraft.visibility)}`}</li>
					<li>{`Notes: ${aircraft.notes}`}</li>
				</ul>
			</div>
		</LogViewerCard>
	</div>
	{#if logs.length > 0}
		<div class="mt-10"></div>
		<Logbook
			title={`Logs taken with '${aircraft.nickname}'`}
			{logs}
			aircrafts={[aircraft]}
			{supabase}
		></Logbook>
	{/if}
</Container>

<Title title="Aircraft Viewer"></Title>
