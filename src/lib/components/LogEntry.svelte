<script lang="ts">
	import { page } from '$app/stores';
	import { addParams, hrefs, getDuration, formatDate } from '$lib';

	let {
		log = $bindable(),
		shade,
		aircrafts,
		onoptions
	}: {
		log: Log;
		shade: boolean;
		aircrafts: Aircraft[];
		onoptions: () => void;
	} = $props();
	const origin: string = $page.url.origin;

	function formatRating(rating: typeof log.rating): string {
		if (rating === 'instrument') return 'IFR';
		return 'VFR';
	}

	// Finds the aircraft that corresponds to the log
	const aircraft: Aircraft = aircrafts.find((item) => item.id == log.aircraft)!;
</script>

<div
	class="grid grid-cols-3 px-3 py-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7"
	class:bg-base-200={shade}
>
	<div class="col-auto flex flex-col justify-center gap-1">
		<h2 class="font-bold">{log.dep_airport.icao} TO {log.des_airport.icao}</h2>
		<h6 class="text-sm font-light">{formatDate(log.dep_time)}</h6>
	</div>
	<div class="col-auto hidden items-center md:flex">
		<h2>{getDuration(log.dep_time, log.des_time)}</h2>
	</div>
	<div class="col-auto hidden items-center sm:flex">
		<a class="link" href={addParams(hrefs.aircraft, { id: aircraft.id.toString() }, origin)}
			>{aircraft.nickname}</a
		>
	</div>
	<div class="col-auto hidden items-center lg:flex">
		<h2>{formatRating(log.rating)}</h2>
	</div>
	<div class=" col-auto hidden items-center lg:flex"><h2>{log.pilot_in_command}</h2></div>
	<div class="col-auto flex items-center">
		<button onclick={onoptions} class="btn btn-info">Options</button>
	</div>
	<div class=" col-auto flex items-center">
		<span
			>{log.created_at.toLocaleString('en-US', {
				year: 'numeric',
				month: 'short',
				day: '2-digit',
				hour: 'numeric',
				minute: 'numeric'
			})}</span
		>
	</div>
</div>
