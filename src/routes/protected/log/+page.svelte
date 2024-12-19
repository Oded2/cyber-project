<script lang="ts">
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import LogDateInput from '$lib/components/LogDateInput.svelte';
	import LogInput from '$lib/components/LogInput.svelte';
	import LogSection from '$lib/components/LogSection.svelte';
	import LogSelect from '$lib/components/LogSelect.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { profile, aircrafts } = data;
	const aircraftValues: { display: string; id: string }[] = aircrafts.map((item) => ({
		display: item.nickname,
		id: item.id.toString()
	}));
</script>

<main>
	<Container>
		<main>
			<Container>
				<form method="POST">
					<!-- Hidden submit button that actually submits the form -->
					<button class="hidden" aria-label="Submit" id="submit" type="submit"></button>
					<div class="card mx-auto mb-10 mt-5 max-w-5xl shadow-xl">
						<div class="card-body">
							<div class="mb-2">
								<h2 class="card-title">Log Flight</h2>
							</div>
							<div class="flex flex-col gap-4">
								<LogSection>Basic Details</LogSection>
								<LogInput name="pilot_in_command" value={profile.display} required maxlength={50}
								></LogInput>
								<LogSelect name="aircraft" values={aircraftValues}></LogSelect>
								<LogSection>Departure Details</LogSection>
								<LogInput
									name="dep_airport"
									displayName="Airport"
									placeholder="ICAO or IATA code"
									required
									minlength={3}
									maxlength={4}
								></LogInput>
								<LogDateInput name="des_time" displayName="Date" required></LogDateInput>
							</div>
						</div>
					</div>
				</form>
			</Container>
		</main>
	</Container>
</main>

<Title title="Log"></Title>
