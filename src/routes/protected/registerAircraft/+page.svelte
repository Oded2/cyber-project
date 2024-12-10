<script lang="ts">
	import { format } from '$lib';
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import YearInput from '$lib/components/YearInput.svelte';

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
	const maxLength = 100;
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
			name: 'year_of_manufacture',
			required: true,
			inputType: 'year',
			page: 0
		},
		{
			name: 'aircraft_type',
			required: true,
			inputType: 'select',
			values: aircraftTypes,
			page: 1
		},
		{
			name: 'aircraft_engine',
			required: true,
			inputType: 'select',
			values: engineTypes,
			page: 1
		}
	];

	function validate(): boolean {
		for (const val of inputs) {
			const element = document.getElementById(val.name) as HTMLInputElement | HTMLSelectElement;
			const valueLength = element.value.length;
			if (valueLength > maxLength || valueLength == 0) {
				element.parentElement?.classList.add('input-error');
				return false;
			}
		}
		return true;
	}
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
						<li class="step step-primary">Basic Details</li>
						<li class="step">Technical Specifications</li>
						<li class="step">Purchase</li>
						<li class="step">Receive Product</li>
					</ul>
					<div class="flex flex-col gap-4">
						{#each inputs as input}
							{#if input.page == step}
								{#if input.inputType === 'text'}
									<AircraftInput
										id={input.name}
										required={input.required}
										name={input.name}
										placeholder={input.placeholder!}
									></AircraftInput>
								{:else if input.inputType === 'select'}
									<AircraftSelect
										id={input.name}
										required={input.required}
										name={input.name}
										values={input.values!}
									></AircraftSelect>
								{:else if input.inputType === 'year'}
									<YearInput name={input.name} id={input.name} required={input.required}
									></YearInput>
								{/if}
							{/if}
						{/each}

						<button type="button" class="btn btn-primary ms-auto w-full max-w-xs" onclick={validate}
							>Click</button
						>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
