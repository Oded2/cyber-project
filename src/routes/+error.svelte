<script lang="ts">
	import { page } from '$app/stores';
	import { hrefs } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	const url = $page;
</script>

<main>
	<Container>
		<div id="screen" class="flex h-screen w-full flex-col items-center justify-center gap-2">
			<h1 class="text-7xl">{url.status}</h1>
			<h2 class="text-3xl">{url.error?.message}</h2>
			<a href={hrefs.home} class="btn btn-neutral mt-2 rounded-3xl">Back to Home</a>
		</div>
	</Container>
</main>

<Title title={`${url.status} Error`}></Title>
