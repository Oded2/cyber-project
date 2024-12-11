<script lang="ts">
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';

	const currentYear = new Date().getFullYear();

	const engineTypes: string[] = [
		'Piston',
		'Turboprop',
		'Turbofan',
		'Jet Engine',
		'Electric',
		'Rotary/Wankel',
		'Rocket Engine',
		'Hybrid'
	];
	const aircraftCategories: string[] = [
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
	];

	const aircraftTypes: string[] = [
		'Fixed-Wing',
		'Rotorcraft',
		'Unmanned Aerial Vehicle)',
		'Glider',
		'Balloon',
		'Airship',
		'Amphibious',
		'Seaplane',
		'Tiltrotor',
		'Autogyro'
	];

	let currentStep = $state(0);
	const maxLength = 100;
	const steps = [
		'Basic Details',
		'Technical Specifications (1/2)',
		'Technical Specifications (2/2)',
		'More Details'
	];
	const inputs = [
		{
			name: 'nickname',
			placeholder: 'Bald Eagle',
			required: true,
			inputType: 'text',
			page: 0
		},
		{
			name: 'tail_number',
			placeholder: 'N12345',
			required: true,
			inputType: 'text',
			page: 0
		},
		{
			name: 'model',
			placeholder: 'Cessna 172',
			required: true,
			inputType: 'text',
			page: 0
		},
		{
			name: 'manufacturer',
			placeholder: 'Cessna',
			required: true,
			inputType: 'text',
			page: 0
		},
		{
			name: 'year_of_manufacture',
			required: true,
			inputType: 'number',
			page: 0,
			min: 1903,
			max: currentYear
		},
		{
			name: 'aircraft_type',
			required: true,
			inputType: 'select',
			values: aircraftTypes,
			page: 1
		},
		{
			name: 'category',
			required: true,
			inputType: 'select',
			values: aircraftCategories,
			page: 1
		},
		{
			name: 'aircraft_engine',
			required: true,
			inputType: 'select',
			values: engineTypes,
			page: 1
		},
		{
			name: 'number_of_engines',
			required: true,
			inputType: 'number',
			page: 1,
			min: 1,
			max: 999999
		},
		{
			name: 'maximum_takeoff_weight',
			required: true,
			inputType: 'number',
			page: 1,
			min: 1,
			max: 999999,
			placeholder: '(lbs)'
		},
		{
			name: 'wingspan',
			required: true,
			inputType: 'number',
			page: 2,
			min: 1,
			max: 999999,
			placeholder: '(ft)'
		},
		{
			name: 'range',
			required: true,
			inputType: 'number',
			page: 2,
			min: 1,
			max: 999999,
			placeholder: '(NM)'
		},
		{
			name: 'cruising_speed',
			required: true,
			inputType: 'number',
			page: 2,
			min: 1,
			max: 999999,
			placeholder: '(knots)'
		},
		{
			name: 'fuel_capacity',
			required: true,
			inputType: 'number',
			page: 2,
			min: 1,
			max: 999999,
			placeholder: '(gallons)'
		},
		{
			name: 'fuel_type',
			required: true,
			inputType: 'text',
			page: 2,
			placeholder: 'Jet A'
		},
		{
			name: 'owner_name',
			required: true,
			inputType: 'text',
			page: 3,
			placeholder: 'Sully'
		},
		{
			name: 'seating_capacity',
			required: true,
			inputType: 'number',
			page: 3,
			min: 1,
			max: 999999
		},
		{
			name: 'modifications',
			required: false,
			inputType: 'text',
			page: 3,
			placeholder: 'Extended fuel range'
		},
		{
			name: 'notes',
			required: false,
			inputType: 'text',
			page: 3,
			placeholder: '"Flown primarily for short-haul routes"'
		},
		{
			name: 'visibility ',
			required: true,
			inputType: 'select',
			page: 3,
			values: ['private', 'public', 'unlisted'],
			allowOther: false
		}
	];

	function validate(): void {
		// For loop iterating all of the inputs
		for (const val of inputs) {
			const element = document.getElementById(val.name) as HTMLInputElement | HTMLSelectElement;
			// Input element
			const valueLength = element.value.length;
			if (valueLength > maxLength || (valueLength == 0 && val.required)) {
				// Any input over the maximum length is invalid, but only required inputs cannot be empty
				element.parentElement?.classList.add('input-error');
				currentStep = val.page;
				// Sets the current page to the input's page, so the user automatically navigates to the invalidated input
				return;
			}
		}
		document.getElementById('submit')?.click();
		// Formally submits the form
	}
</script>

<main>
	<Container>
		<form method="POST">
			<button class="hidden" aria-label="Submit" id="submit" type="submit"></button>
			<div class="card mx-auto mb-10 mt-5 max-w-4xl shadow-xl">
				<div class="card-body">
					<div class="mb-2">
						<h2 class="card-title">Register Aircraft</h2>
					</div>
					<ul class="steps mb-2">
						{#each steps as step, index}
							<li class="step" class:step-info={index <= currentStep}>{step}</li>
						{/each}
					</ul>
					<div class="flex flex-col gap-4">
						{#each inputs as input}
							<div hidden={currentStep != input.page}>
								<!-- The hidden attribute allows only the questions that are supposed to appear according to the page number appear -->
								{#if input.inputType === 'text'}
									<AircraftInput
										required={input.required}
										id={input.name}
										name={input.name}
										placeholder={input.placeholder!}
									></AircraftInput>
								{:else if input.inputType === 'select'}
									<AircraftSelect
										id={input.name}
										name={input.name}
										values={input.values!}
										allowOther={input.allowOther}
									></AircraftSelect>
								{:else if input.inputType === 'number'}
									<NumberInput
										min={input.min!}
										max={input.max!}
										name={input.name}
										id={input.name}
										placeholder={input.placeholder}
									></NumberInput>
								{/if}
							</div>
						{/each}
						<div class="flex gap-4">
							{#if currentStep != 0}
								<button
									type="button"
									class="btn btn-outline btn-info me-auto w-full max-w-48"
									onclick={() => currentStep--}>Back</button
								>
							{/if}
							{#if currentStep == steps.length - 1}
								<button
									type="button"
									class="btn btn-info ms-auto w-full max-w-48"
									onclick={() => validate()}>Submit</button
								>
							{:else}
								<button
									type="button"
									class="btn btn-info ms-auto w-full max-w-48"
									onclick={() => currentStep++}>Next</button
								>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
