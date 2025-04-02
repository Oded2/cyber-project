<script lang="ts">
	import { extractTime, formatDate, maxDate, minDate } from '$lib';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import Container from '$lib/components/Container.svelte';
	import LogInput from '$lib/components/LogInput.svelte';
	import LogSection from '$lib/components/LogSection.svelte';
	import LogTextarea from '$lib/components/LogTextarea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addToast } from '$lib/toasts.js';
	import type { EventHandler } from 'svelte/elements';

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
	const extractedTime = extractTime();

	let dateDisclaimer: string | undefined = $state();

	const checkDate: EventHandler<Event, HTMLInputElement> = (e) => {
		const value = new Date(e.currentTarget.value);
		if (value < minDate)
			dateDisclaimer = `Weather data will not be attached to this log due to the date being prior to ${formatDate(minDate)}`;
		else if (value > maxDate)
			dateDisclaimer = `Weather data will not be attached to this log due to the date being post ${formatDate(maxDate)}`;
		else {
			dateDisclaimer = undefined;
			return;
		}
		addToast({ type: 'info', text: dateDisclaimer, duration: 5000 });
	};
</script>

<Container>
	<form method="POST">
		<div class="card mx-auto mt-5 mb-10 max-w-3xl shadow-xl">
			<div class="card-body">
				<div class="mb-2">
					<h2 class="card-title">Log Flight</h2>
				</div>
				<div class="flex flex-col gap-4">
					<LogSection>Basic Details</LogSection>
					<LogInput name="pilot_in_command" value={profile.display} required max={50}></LogInput>
					<AircraftSelect name="aircraft" values={aircraftValues}></AircraftSelect>
					<LogInput
						type="number"
						name="altitude"
						displayName="Cruising Altitude in Feet"
						min={0}
						max={200000}
					></LogInput>
					<AircraftSelect name="rating" values={ratings}></AircraftSelect>
					<LogInput
						type="number"
						name="fuel_usage"
						displayName="Fuel Used in Gallons"
						min={0}
						max={200000}
					></LogInput>
					<LogSection>Departure Details</LogSection>
					<LogInput
						name="dep_airport"
						displayName="Airport"
						placeholder="ICAO or IATA code"
						autocorrect="off"
						required
						min={3}
						max={4}
					></LogInput>
					<LogInput
						type="date"
						name="date"
						value={predefinedDate}
						required
						disclaimer={dateDisclaimer}
						onchange={checkDate}
					></LogInput>
					<LogInput type="time" name="dep_time" displayName="Time" value={extractedTime} required
					></LogInput>
					<LogSection>Destination Details</LogSection>
					<LogInput
						name="des_airport"
						displayName="Airport"
						placeholder="ICAO or IATA code"
						autocorrect="off"
						required
						min={3}
						max={4}
					></LogInput>
					<LogInput type="time" name="des_time" displayName="Time" value={extractedTime} required
					></LogInput>
					<LogSection>Additional Details</LogSection>
					<LogTextarea name="notes" maxlength={10000}></LogTextarea>
					<AircraftSelect name="visibility" values={visibilities}></AircraftSelect>
					<Checkbox name="favorite" text="Favorite"></Checkbox>
				</div>
				<div class="card-actions justify-end">
					<button type="submit" class="btn btn-primary">Submit</button>
				</div>
			</div>
		</div>
	</form>
</Container>

<Title title="Log"></Title>
