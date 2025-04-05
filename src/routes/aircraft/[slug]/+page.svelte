<script lang="ts">
	import { format, hrefs } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Logbook from '$lib/components/Logbook.svelte';
	import LogViewerCard from '$lib/components/LogViewerCard.svelte';
	import Ref from '$lib/components/Ref.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { aircraft, profile, logs, supabase, ref, user } = data;
	const isOwner = user?.id === aircraft.owner;
</script>

<Container>
	<h1 class="text-center text-3xl font-medium">
		Aircraft: <span class="italic">{aircraft.nickname}</span>
	</h1>
	<h3 class="text-center font-medium">
		Registered to: <a href={hrefs.profile.replace('slug', profile.username)} class="link"
			>{profile.display}</a
		>
	</h3>
	<div class="mt-10 grid gap-4 lg:grid-cols-3">
		<LogViewerCard title="Basic Info" image={aircraft.image_url}>
			<div class="prose">
				<ul>
					<li>{`Tail Number: ${aircraft.tail_number}`}</li>
					{#if aircraft.model}
						<li>{`Model: ${aircraft.model}`}</li>
					{/if}
					{#if aircraft.manufacturer}
						<li>{`Manufacturer: ${aircraft.manufacturer}`}</li>
					{/if}
					{#if aircraft.year_of_manufacture}
						<li>{`Year of Manufacture: ${aircraft.year_of_manufacture}`}</li>
					{/if}
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Technical Details">
			<div class="prose">
				<ul>
					<li>{`Aircraft Type: ${aircraft.aircraft_type}`}</li>
					<li>{`Category: ${aircraft.category}`}</li>
					{#if aircraft.number_of_engines}
						<li>{`Engines: ${aircraft.number_of_engines.toLocaleString()}`}</li>
					{/if}
					{#if aircraft.maximum_takeoff_weight}
						<li>
							{`Maximum Takeoff Weight: ${aircraft.maximum_takeoff_weight.toLocaleString()} lbs`}
						</li>
					{/if}
					{#if aircraft.wingspan}
						<li>{`Wingspan: ${aircraft.wingspan.toLocaleString()} ft`}</li>
					{/if}
					{#if aircraft.range}
						<li>{`Range: ${aircraft.range.toLocaleString()} NM`}</li>
					{/if}
					{#if aircraft.cruising_speed}
						<li>{`Cruising Speed: ${aircraft.cruising_speed.toLocaleString()} KN`}</li>
					{/if}
					{#if aircraft.fuel_capacity}
						<li>{`Fuel Capacity: ${aircraft.fuel_capacity.toLocaleString()} Gallons`}</li>
					{/if}
					{#if aircraft.fuel_type}
						<li>{`Fuel Type: ${aircraft.fuel_type}`}</li>
					{/if}
				</ul>
			</div>
		</LogViewerCard>
		<LogViewerCard title="Miscellaneous">
			<div class="prose">
				<ul>
					{#if aircraft.owner_name}
						<li>{`Owner: ${aircraft.owner_name}`}</li>
					{/if}
					{#if aircraft.seating_capacity}
						<li>{`Seating Capacity: ${aircraft.seating_capacity}`}</li>
					{/if}
					<li>{`Visibility: ${format(aircraft.visibility)}`}</li>
					{#if aircraft.notes}
						<li>{`Notes: ${aircraft.notes}`}</li>
					{/if}
				</ul>
			</div>
		</LogViewerCard>
	</div>
	{#if logs.length > 0}
		<div class="mt-10"></div>
		<Logbook
			title={`Logs taken with '${aircraft.nickname}'`}
			edit={isOwner}
			{logs}
			aircrafts={[aircraft]}
			{supabase}
		></Logbook>
	{/if}
</Container>

<Ref {ref}></Ref>

<Title title="Aircraft Viewer"></Title>
