<script lang="ts">
	import { format } from '$lib';
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

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
	const aircraftTypes: string[] = [
		'Commercial',
		'Private',
		'Military',
		'Cargo',
		'UAV',
		'Helicopter',
		'Amphibious',
		'Fighter Jet',
		'Transport',
		'Trainer',
		'Reconnaissance',
		'Tanker',
		'Lighter-than-air',
		'Business Jet',
		'Glider',
		'Experimental'
	];

	let step = 0;
	const steps = [];
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
			name: 'aircraft_type',
			required: true,
			inputType: 'select',
			values: aircraftTypes,
			page: 0
		},
		{
			name: 'aircraft_engine',
			required: true,
			inputType: 'select',
			values: engineTypes,
			page: 0
		}
	];
</script>

<main>
	<Container>
		<form>
			<div class="card mx-auto mt-10 max-w-3xl shadow-xl">
				<div class="card-body">
					<div class="mb-2">
						<h2 class="card-title">Register Aircraft</h2>
					</div>
					<ul class="steps mb-2">
						<li class="step step-primary">Register</li>
						<li class="step">Choose plan</li>
						<li class="step">Purchase</li>
						<li class="step">Receive Product</li>
					</ul>
					<div class="flex flex-col gap-4">
						{#each inputs as input}
							{#if input.page === step}
								{#if input.inputType === 'text'}
									<AircraftInput
										required={input.required}
										name={input.name}
										placeholder={input.placeholder!}
									></AircraftInput>
								{:else if input.inputType === 'select'}
									<AircraftSelect required={input.required} name={input.name} values={input.values!}
									></AircraftSelect>
								{/if}
							{/if}
						{/each}

						<button class="btn btn-primary ms-auto w-full max-w-xs">Click</button>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
