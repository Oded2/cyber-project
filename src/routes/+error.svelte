<script lang="ts">
	import { page } from '$app/stores';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	const url = $page;
</script>

<main>
	<Container>
		<div class="card mx-auto mt-10 max-w-md shadow-lg">
			<div class="card-body">
				<div class="text-center">
					<h1 class="text-2xl">{url.status} Error</h1>
					<h2 class="text-xl">{url.error?.message}</h2>
				</div>
			</div>
		</div>
	</Container>
</main>

<Title title={`${url.status} Error`}></Title>
