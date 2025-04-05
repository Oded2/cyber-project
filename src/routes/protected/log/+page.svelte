<script lang="ts">
	import { addParams, extractTime, formatDate, hrefs, maxDate, minDate, showModal } from '$lib';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Card from '$lib/components/Card.svelte';
	import CardActions from '$lib/components/CardActions.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import LogInput from '$lib/components/LogInput.svelte';
	import LogSection from '$lib/components/LogSection.svelte';
	import LogTextarea from '$lib/components/LogTextarea.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addToast } from '$lib/toasts.js';
	import { onMount } from 'svelte';

	const { data } = $props();
	const { profile, aircrafts, predefinedDate } = data;

	const aircraftValues: SelectValues = aircrafts.map((item) => ({
		display: item.nickname,
		id: item.id.toString()
	}));
	const visibilities: SelectValues = [
		{ id: 'private', display: 'Private' },
		{ id: 'public', display: 'Public' },
		{ id: 'unlisted', display: 'Unlisted' }
	];
	const ratings: SelectValues = [
		{ id: 'visual', display: 'VFR' },
		{ id: 'instrument', display: 'IFR' }
	];
	const extractedTime = extractTime();

	let dateDisclaimer: string | undefined = $state();

	onMount(() => {
		if (aircrafts.length > 0) checkDate(predefinedDate);
	});

	function checkDate(val: string): void {
		const value = new Date(val);
		if (value < minDate)
			dateDisclaimer = `Weather data will not be attached to this log due to the date being prior to ${formatDate(minDate)}.`;
		else if (value > maxDate)
			dateDisclaimer = `Weather data will not be attached to this log due to the date being post ${formatDate(maxDate)}.`;
		else {
			dateDisclaimer = undefined;
			return;
		}
		addToast({ type: 'info', text: dateDisclaimer, duration: 5000 });
	}
</script>

<Container>
	{#if aircrafts.length > 0}
		<form method="POST">
			<FormCard title="Log Flight" includeSubmitButton>
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
					onchange={(e) => checkDate(e.currentTarget.value)}
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
				<Checkbox name="fetchWeather" text="Fetch weather data"></Checkbox>
			</FormCard>
		</form>
	{:else}
		<Card title="No aircrafts registered">
			<p>You must add new aircrafts to your account before logging flights.</p>
			<CardActions>
				<a href={hrefs.home} class="btn btn-secondary">Go Home</a>
				<a href={addParams(hrefs.settings, { page: 'aircraft' })} class="btn btn-primary"
					>Add Aircrafts</a
				>
			</CardActions>
		</Card>
	{/if}
</Container>

<Title title="Log"></Title>
