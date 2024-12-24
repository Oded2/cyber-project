<script lang="ts">
	import { page } from '$app/stores';
	import { addParams, hrefs } from '$lib';

	const { log, shade, aircrafts }: { log: Log; shade: boolean; aircrafts: Aircraft[] } = $props();
	const origin: string = $page.url.origin;

	function getDuration(date1: Date, date2: Date): string {
		// This function takes the difference in time between two dates and formats it
		const miliseconds = Math.abs(date1.getTime() - date2.getTime());
		const hours = Math.floor(miliseconds / 3600000);
		const minutes = (miliseconds / 60000) % 60;
		if (hours == 0) return `${minutes} minutes`;
		if (minutes == 0) return `${hours} hours`;
		return `${hours} hours and ${minutes} minutes`;
	}

	function formatRating(rating: typeof log.rating): string {
		if (rating === 'instrument') return 'IFR';
		return 'VFR';
	}

	const aircraft: Aircraft = aircrafts.find((item) => item.id == log.aircraft)!;
</script>

<div class="grid grid-cols-6 px-3 py-5" class:bg-base-200={shade}>
	<div class="col-auto"><h2 class="font-bold">{log.dep_airport} TO {log.des_airport}</h2></div>
	<div class="col-auto"><h2>{getDuration(log.dep_time, log.des_time)}</h2></div>
	<div class="col-auto">
		<a class="link" href={addParams(hrefs.aircraft, { id: aircraft.id.toString() }, origin)}
			>{aircraft.nickname}</a
		>
	</div>
	<div class="col-auto">
		<h2>{formatRating(log.rating)}</h2>
	</div>
	<div class=" col-auto"><h2>{log.pilot_in_command}</h2></div>
	<!-- <div class="col-auto"><button class="btn btn-info">View</button></div> -->
</div>
