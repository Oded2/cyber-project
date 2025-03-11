<script lang="ts">
	import { hrefs, defaultProfilePicture } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();
	const { supabase, user } = data;

	let input: string = $state('');
	let searchResults: Profile[] = $state([]);
	let inProgress: boolean = $state(false);

	async function search(e: Event): Promise<void> {
		e.preventDefault();
		// Build the SQL query
		let query = supabase
			.from('profiles')
			.select()
			.or(`display.ilike.%${input}%,username.ilike.%${input}%`);
		// Ensure that the user doesn't show up in the search results
		if (user) query = query.not('id', 'eq', user.id);
		// Limit to the first 10 results
		query.limit(10);
		inProgress = true;
		const { data: results, error } = await query;
		inProgress = false;
		if (error) {
			console.error(error);
			return;
		}
		searchResults = results as typeof searchResults;
		// if the search result matches the exact username, then that result will be placed first
		const exactIndex = searchResults.findIndex((item) => item.username === input);
		if (exactIndex != -1) {
			// Since splice returns an array, using [item] ensures that item is the first (and only) removed item
			const [item] = searchResults.splice(exactIndex, 1);
			searchResults.unshift(item);
		}
	}
</script>

<Container>
	<div class="flex flex-col items-center gap-4">
		<h1 class="text-3xl font-bold">Search</h1>
		<form class="join shadow-xl" onsubmit={search}>
			<input
				type="text"
				class="join-item mx-auto w-96 bg-transparent px-4 shadow-inner outline-hidden"
				placeholder="Search for a pilot"
				bind:value={input}
			/>
			<button
				class="btn join-item btn-neutral"
				aria-label="Search"
				type="submit"
				disabled={inProgress}><i class="fa-solid fa-magnifying-glass"></i></button
			>
		</form>
		<div class="flex w-full max-w-md flex-col gap-4">
			{#each searchResults as result}
				<a href={hrefs.profile.replace('slug', result.username)} class="w-full">
					<div class="flex gap-8 rounded-sm bg-base-200 px-4 py-2 shadow-sm transition hover:shadow-lg">
						<div class="avatar">
							<div class="w-12 rounded-full bg-white">
								<img
									src={result.image.length > 0 ? result.image : defaultProfilePicture}
									alt={result.username}
								/>
							</div>
						</div>
						<div class="flex w-full flex-col">
							<span>{result.display}</span>
							<span class="text-sm font-light">{result.username}</span>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</Container>

<Title title="Search"></Title>
