<script lang="ts">
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
		'Hybrid',
		'Other'
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
</script>

<main>
	<Container>
		<form action="">
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
						<div>
							<AircraftInput required name="model" placeholder="Cessna 172"></AircraftInput>
						</div>
						<div>
							<AircraftInput required name="tail_number" placeholder="N12345"></AircraftInput>
						</div>
						<div>
							<AircraftInput required name="manufacturer" placeholder="Cessna"></AircraftInput>
						</div>
						<div>
							<AircraftSelect values={aircraftTypes} name="aircraft_type"></AircraftSelect>
						</div>
						<div>
							<AircraftSelect values={engineTypes} name="engine_type"></AircraftSelect>
						</div>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
