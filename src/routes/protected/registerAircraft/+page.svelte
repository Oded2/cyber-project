<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
</script>

<main>
	<Container>
		<form action="">
			<div class="card mx-auto mt-10 max-w-5xl shadow-xl">
				<div class="card-body">
					<div class="mb-2 pb-2">
						<h2 class="card-title">Regiter Aircraft</h2>
					</div>
					<div class="grid grid-cols-8 gap-4">
						<div class="col-span-2">
							<label class="input input-bordered mb-3 flex items-center gap-2">
								Model
								<input
									type="text"
									name="model"
									class="grow"
									placeholder="Cessna 172"
									required
									max="100"
								/>
							</label>
						</div>
						<div class="col-span-2">
							<label class="input input-bordered mb-3 flex items-center gap-2">
								Registration
								<input
									type="text"
									name="registration"
									class="grow"
									placeholder="N12345"
									required
									max="100"
								/>
							</label>
						</div>
						<div class="col-span-2">
							<label class="input input-bordered mb-3 flex items-center gap-2">
								Manufacturer
								<input
									type="text"
									name="manufacturer"
									class="grow"
									placeholder="Cessna"
									required
									max="100"
								/>
							</label>
						</div>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
