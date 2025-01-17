<script lang="ts">
	import { getDuration, getTimeDifference, hrefs } from '$lib';

	const { logs, aircrafts }: { logs: Log[]; aircrafts: Aircraft[] } = $props();

	const longest = logs.reduce((max, current) => {
		const differenceMax = getTimeDifference(max.dep_time, max.des_time);
		const differenceCurrent = getTimeDifference(current.dep_time, current.des_time);
		return differenceCurrent > differenceMax ? current : max;
	});
	const shortest = logs.reduce((min, current) => {
		const differenceMin = getTimeDifference(min.dep_time, min.des_time);
		const differenceCurrent = getTimeDifference(current.dep_time, current.des_time);
		return differenceCurrent < differenceMin ? current : min;
	});
</script>

<div class="mt-10 grid grid-cols-2 gap-4">
	<div class="col-auto">
		{@render statCard('Longest Flight', longest)}
	</div>
	<div class="col-auto">
		{@render statCard('Shortest Flight', shortest)}
	</div>
</div>

{#snippet statCard(title: string, log: Log)}
	{@const aircraft = aircrafts.find((item) => item.id == log.aircraft)}
	<div class="card glass h-full bg-primary">
		<div class="card-body text-primary-content">
			<h2 class="card-title mb-3">{title}</h2>
			<h1 class="text-xl font-bold">{`${log.dep_airport.icao} TO ${log.dep_airport.icao}`}</h1>
			<h1 class="text-xl font-semibold">{getDuration(log.dep_time, log.des_time)}</h1>
			{#if aircraft}
				<h1 class="text-xl font-semibold">
					Aircraft: <a href={hrefs.aircraft.replace('slug', aircraft.id.toString())}
						>{aircraft.nickname}</a
					>
				</h1>
			{/if}
		</div>
		{#if aircraft && aircraft.image_url.length > 0}
			<figure class="h-1/2">
				<img src={aircraft.image_url} alt={aircraft.nickname} />
			</figure>
		{/if}
	</div>
{/snippet}
