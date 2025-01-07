<script lang="ts">
	import { formatSpecificDate } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { log } = data;
</script>

<Container>
	<div class="my-10 border-b-2 text-center">
		<h1 class="text-xl">
			<span class="font-bold">{log.dep_airport}</span> <i class="fa-solid fa-arrow-right"></i>
			<span class="font-bold"> {log.des_airport}</span>
		</h1>
		<h2>{formatSpecificDate(log.dep_time)}</h2>
	</div>
</Container>

<Title title="Log Viewer"></Title>
