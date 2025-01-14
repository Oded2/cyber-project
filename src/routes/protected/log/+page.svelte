<script lang="ts">
	import { formatDateTime } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import LogDateInput from '$lib/components/LogDateInput.svelte';
	import LogInput from '$lib/components/LogInput.svelte';
	import LogNumberInput from '$lib/components/LogNumberInput.svelte';
	import LogSection from '$lib/components/LogSection.svelte';
	import LogSelect from '$lib/components/LogSelect.svelte';
	import LogTextarea from '$lib/components/LogTextarea.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { profile, aircrafts, predefinedDate } = data;
	const aircraftValues: { display: string; id: string }[] = aircrafts.map((item) => ({
		display: item.nickname,
		id: item.id.toString()
	}));
	const visibilities: { display: string; id: string }[] = [
		{ id: 'private', display: 'Private' },
		{ id: 'public', display: 'Public' },
		{ id: 'unlisted', display: 'Unlisted' }
	];
	const ratings: { display: string; id: string }[] = [
		{ id: 'visual', display: 'VFR' },
		{ id: 'instrument', display: 'IFR' }
	];
</script>

<Container>
	<form method="POST">
		<div class="card mx-auto mb-10 mt-5 max-w-3xl shadow-xl">
			<div class="card-body">
				<div class="mb-2">
					<h2 class="card-title">Log Flight</h2>
				</div>
				<div class="flex flex-col">
					<LogSection>Basic Details</LogSection>
					<LogInput name="pilot_in_command" value={profile.display} required maxlength={50}
					></LogInput>
					<LogSelect name="aircraft" values={aircraftValues}></LogSelect>
					<LogNumberInput
						name="altitude"
						displayName="Cruising Altitude in Feet"
						min={0}
						max={200000}
					></LogNumberInput>
					<LogSelect name="rating" values={ratings}></LogSelect>
					<LogNumberInput name="fuel_usage" displayName="Fuel Used in Gallons" min={0} max={200000}
					></LogNumberInput>
					<LogSection>Departure Details</LogSection>
					<LogInput
						name="dep_airport"
						displayName="Airport"
						placeholder="ICAO or IATA code"
						autocorrect="off"
						required
						minlength={3}
						maxlength={4}
					></LogInput>
					<LogDateInput
						value={formatDateTime(predefinedDate)}
						name="dep_time"
						attributeChange={{ id: 'des_time', attribute: 'min' }}
						displayName="Date & Time"
						required
					></LogDateInput>
					<LogSection>Destination Details</LogSection>
					<LogInput
						name="des_airport"
						displayName="Airport"
						placeholder="ICAO or IATA code"
						autocorrect="off"
						required
						minlength={3}
						maxlength={4}
					></LogInput>
					<LogDateInput
						value={formatDateTime(predefinedDate)}
						name="des_time"
						attributeChange={{ id: 'dep_time', attribute: 'max' }}
						displayName="Date & Time"
						required
					></LogDateInput>
					<LogSection>Additional Details</LogSection>
					<LogTextarea name="notes" maxlength={10000}></LogTextarea>
					<LogSelect name="visibility" values={visibilities}></LogSelect>
				</div>
				<div class="card-actions justify-end">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</div>
		</div>
	</form>
</Container>

<Title title="Log"></Title>
