<script lang="ts">
	import { page } from '$app/stores';
	import { addParams, hrefs, getDuration } from '$lib';

	const {
		log,
		shade,
		aircrafts,
		ondelete
	}: { log: Log; shade: boolean; aircrafts: Aircraft[]; ondelete: () => void } = $props();
	const origin: string = $page.url.origin;

	function formatRating(rating: typeof log.rating): string {
		if (rating === 'instrument') return 'IFR';
		return 'VFR';
	}

	const aircraft: Aircraft = aircrafts.find((item) => item.id == log.aircraft)!;
</script>

<div class="grid grid-cols-6 px-3 py-5" class:bg-base-200={shade}>
	<div class="col-auto flex items-center">
		<h2 class="font-bold">{log.dep_airport.icao} TO {log.des_airport.icao}</h2>
	</div>
	<div class="col-auto flex items-center"><h2>{getDuration(log.dep_time, log.des_time)}</h2></div>
	<div class="col-auto flex items-center">
		<a class="link" href={addParams(hrefs.aircraft, { id: aircraft.id.toString() }, origin)}
			>{aircraft.nickname}</a
		>
	</div>
	<div class="col-auto flex items-center">
		<h2>{formatRating(log.rating)}</h2>
	</div>
	<div class=" col-auto flex items-center"><h2>{log.pilot_in_command}</h2></div>
	<div class="join col-auto flex items-center">
		<a
			href={addParams(
				hrefs.logView.replace('slug', log.id.toString()),
				{ ref: hrefs.logbook },
				origin
			)}
			class="btn btn-info join-item">View</a
		>
		<button aria-label="Delete" class="btn btn-outline btn-info join-item" onclick={ondelete}
			><i class="fa-solid fa-trash"></i></button
		>
	</div>
</div>
