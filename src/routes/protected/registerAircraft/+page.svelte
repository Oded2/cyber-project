<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

	const maxLength: number = 100;
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
							<label class="input input-bordered flex items-center gap-2">
								Model
								<input
									type="text"
									name="model"
									class="grow"
									placeholder="Cessna 172"
									required
									maxlength={maxLength}
								/>
							</label>
						</div>
						<div>
							<label class="input input-bordered flex items-center gap-2">
								Tail Number
								<input
									type="text"
									name="registration"
									class="grow"
									placeholder="N12345"
									required
									maxlength={maxLength}
								/>
							</label>
						</div>
						<div>
							<label class="input input-bordered flex items-center gap-2">
								Manufacturer
								<input
									type="text"
									name="manufacturer"
									class="grow"
									placeholder="Cessna"
									required
									maxlength={maxLength}
								/>
							</label>
						</div>
						<div>
							<select name="engine" class="select select-bordered w-full">
								<option disabled selected>Engine type</option>
								{#each engineTypes as engine}
									<option value={engine}>{engine}</option>
								{/each}
							</select>
						</div>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
