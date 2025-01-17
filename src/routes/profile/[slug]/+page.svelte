<script lang="ts">
	import { defaultProfilePicture, formatDuration } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import ProfileStats from '$lib/components/ProfileStats.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { profile, logs, aircrafts } = data;

	const totalFlightTime = getTotalFlightTime();

	function getTotalFlightTime(): number {
		let total: number = 0;
		for (const log of logs) total += log.des_time.getTime() - log.dep_time.getTime();
		return total;
	}
</script>

<Container>
	<div class="flex gap-4">
		<div class="avatar">
			<div class="w-60 rounded-full bg-white">
				<img
					src={profile.image.length > 0 ? profile.image : defaultProfilePicture}
					alt={profile.username}
				/>
			</div>
		</div>
		<div class="card glass w-full bg-info">
			<div class="card-body text-info-content">
				<h6 class="font-semibold">{profile.username}</h6>
				<h1 class="text-4xl font-bold">{profile.display}</h1>
				<h3 class="text-xl font-semibold">{profile.bio}</h3>
				<h4 class="text-lg font-semibold">{logs.length} Logs</h4>
				<h4 class="text-lg font-semibold">{aircrafts.length} Aircrafts</h4>
				<h4 class="text-lg font-semibold">Total Flight Time: {formatDuration(totalFlightTime)}</h4>
			</div>
		</div>
	</div>
	{#if logs.length > 0}
		<ProfileStats {logs} {aircrafts}></ProfileStats>
	{/if}
</Container>

<Title title={`${profile.display}'s Profile`}></Title>
