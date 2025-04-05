<script lang="ts">
	import { extractDate, extractTime, format, maxDate, minDate } from '$lib';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Container from '$lib/components/Container.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import LogInput from '$lib/components/LogInput.svelte';
	import LogSection from '$lib/components/LogSection.svelte';
	import LogTextarea from '$lib/components/LogTextarea.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { aircraft } = data;
	const maxLength = 50;
	const currentYear = new Date().getFullYear();

	const aircraftTypes: SelectValues = [
		'Fixed-Wing',
		'Rotorcraft',
		'Unmanned Aerial Vehicle',
		'Glider',
		'Balloon',
		'Airship',
		'Amphibious',
		'Seaplane',
		'Tiltrotor',
		'Autogyro'
	].map((val) => ({ id: val, display: val }));

	const aircraftCategories: SelectValues = [
		'Commercial',
		'Private',
		'Military',
		'Cargo',
		'Experimental',
		'Training',
		'Agricultural',
		'Rescue/Medical',
		'Recreational',
		'Research',
		'Government'
	].map((val) => ({ id: val, display: val }));

	const engineTypes: SelectValues = [
		'Piston',
		'Turboprop',
		'Turbofan',
		'Jet Engine',
		'Electric',
		'Rotary/Wankel',
		'Rocket Engine',
		'Hybrid'
	].map((val) => ({ id: val, display: val }));

	const visibilities: SelectValues = ['private', 'public', 'unlisted'].map((val) => ({
		id: val,
		display: format(val)
	}));
</script>

<Container>
	<form method="POST">
		<FormCard title="Register Aircraft" includeSubmitButton>
			<LogSection>Basic Details</LogSection>
			<LogInput
				name="nickname"
				placeholder="Bald Eagle"
				value={aircraft?.nickname}
				required
				max={maxLength}
			></LogInput>
			<LogInput
				name="tail_number"
				placeholder="4X-CHA"
				value={aircraft?.tail_number}
				required
				max={maxLength}
				oninput={(e) => (e.currentTarget.value = e.currentTarget.value.toUpperCase())}
			></LogInput>
			<LogInput
				name="model"
				placeholder="Cessna 172"
				value={aircraft?.model}
				required
				max={maxLength}
			></LogInput>
			<LogInput
				name="manufacturer"
				placeholder="Cessna"
				value={aircraft?.manufacturer}
				required
				max={maxLength}
			></LogInput>
			<LogInput
				type="number"
				name="year_of_manufacture"
				placeholder="1956"
				value={aircraft?.year_of_manufacture.toString()}
				required
				min={1903}
				max={currentYear}
			></LogInput>
			<LogSection>Technical Details</LogSection>
			<AircraftSelect
				name="aircraft_type"
				values={aircraftTypes}
				originalValue={aircraft?.aircraft_type}
			></AircraftSelect>
			<AircraftSelect name="category" values={aircraftCategories} originalValue={aircraft?.category}
			></AircraftSelect>
			<AircraftSelect
				name="aircraft_engine"
				values={engineTypes}
				originalValue={aircraft?.aircraft_engine}
			></AircraftSelect>
			<LogInput
				type="number"
				name="number_of_engines"
				placeholder="1"
				value={aircraft?.number_of_engines.toString()}
				required
				min={1}
				max={999999}
			></LogInput>
			<LogInput
				type="number"
				name="maximum_takeoff_weight"
				placeholder="(lbs)"
				value={aircraft?.maximum_takeoff_weight.toString()}
				required
				min={0}
				max={999999}
			></LogInput>
			<LogInput
				type="number"
				name="wingspan"
				placeholder="(ft)"
				value={aircraft?.wingspan.toString()}
				required
				min={0}
				max={999999}
			></LogInput>
			<LogInput
				type="number"
				name="range"
				placeholder="(NM)"
				value={aircraft?.range.toString()}
				required
				min={0}
				max={999999}
			></LogInput>
			<LogInput
				type="number"
				name="cruising_speed"
				placeholder="(Knots)"
				value={aircraft?.cruising_speed.toString()}
				required
				min={0}
				max={999999}
			></LogInput>
			<LogInput
				type="number"
				name="fuel_capacity"
				placeholder="(Gallons)"
				value={aircraft?.fuel_capacity.toString()}
				required
				min={0}
				max={999999}
			></LogInput>
			<LogInput
				name="fuel_type"
				placeholder="Avgas"
				value={aircraft?.fuel_type}
				required
				max={maxLength}
			></LogInput>
			<LogSection>Additional Information</LogSection>
			<LogInput
				name="owner_name"
				placeholder="Sully"
				value={aircraft?.owner_name}
				required
				max={maxLength}
			></LogInput>
			<LogInput
				type="number"
				name="seating_capacity"
				placeholder="4"
				value={aircraft?.seating_capacity.toString()}
				required
				min={1}
				max={999999}
			></LogInput>
			<LogInput
				name="notes"
				placeholder={'"Used primarily for training"'}
				value={aircraft?.notes}
				max={maxLength}
			></LogInput>
			<LogInput
				name="image_url"
				placeholder="https://example.com/images/cessna.png"
				value={aircraft?.image_url}
				max={5000}
			></LogInput>
			<AircraftSelect name="visibility" values={visibilities} originalValue={aircraft?.visibility}
			></AircraftSelect>
		</FormCard>
	</form>
</Container>

<Title title="Log"></Title>

<!-- <script lang="ts">
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addParams, format, hrefs } from '$lib';

	const { data } = $props();
	const { inputs, aircraft } = data;
	const maxLength = 100;
</script>

<Container>
	<form>
		<div class="card mx-auto mt-5 mb-10 max-w-4xl shadow-xl">
			<div class="card-body">
				<div class="mb-2">
					<h2 class="card-title">
						<a aria-label="Back" href={addParams(hrefs.settings, { page: 'aircraft' })}
							><i class="fa-solid fa-chevron-left"></i></a
						> Register Aircraft
					</h2>
				</div>
				<div class="flex flex-col gap-4">
					{#each inputs as input}
						{#if input.values}
							<AircraftSelect
								originalValue={aircraft ? aircraft[input.name].toString() : ''}
								id={input.name}
								name={input.name}
								values={input.values.map((val) => ({
									id: val,
									display: format(val)
								}))}
								allowOther={input.allowOther}
							></AircraftSelect>
						{:else}
							<AircraftInput
								value={aircraft ? aircraft[input.name].toString() : ''}
								required={input.required}
								id={input.name}
								name={input.name}
								placeholder={input.placeholder!}
								maxLength={input.max ?? maxLength}
								type={input.inputType}
								min={input.min}
								max={input.max}
							></AircraftInput>
						{/if}
					{/each}
					<div class="flex justify-end gap-4">
						<button class="btn btn-info w-full max-w-48" type="submit">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</Container>

<Title title="Register Aircraft"></Title> -->
