<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Modal from './Modal.svelte';
	import { addParams, formatDate, hrefs } from '$lib';
	import { page } from '$app/stores';

	const {
		id,
		log = $bindable(),
		supabase
	}: { id: string; log: Log; supabase: SupabaseClient } = $props();
	// Get the current URL
	const pageUrl = $page.url;
	const visibilities = {
		private: 'Privatize',
		public: 'Publicize',
		unlisted: 'Unlist'
	};

	// Variable to disable the buttons while an asynchronous function is happening
	let inProgress: boolean = $state(false);

	async function changeVisibility(action: keyof typeof visibilities) {
		inProgress = true;
		await supabase.from('logs').update({ visibility: action }).eq('id', log.id);
		inProgress = false;
		log.visibility = action;
	}
	async function changeFavorite() {
		// Since favorite is simply a toggle, the new value will simply be the opposite of the old one
		const action = !log.favorite;
		inProgress = true;
		await supabase.from('logs').update({ favorite: action }).eq('id', log.id);
		inProgress = false;
		log.favorite = action;
	}
</script>

<Modal {id} title={`Options for log from ${formatDate(log.dep_time)}`}>
	<div class="flex flex-col items-center gap-4">
		{@render visibilityButton('private')}
		{@render visibilityButton('public')}
		{@render visibilityButton('unlisted')}
		{@render favoriteButton()}
		<a
			href={addParams(
				hrefs.logView.replace('slug', log.id.toString()),
				{
					ref: pageUrl.toString()
				},
				pageUrl.origin
			)}
			class="btn btn-primary w-full max-w-xs"
			class:btn-disabled={inProgress}>View</a
		>
	</div>
</Modal>

{#snippet favoriteButton()}
	<button
		class="btn btn-outline btn-info w-full max-w-xs"
		onclick={() => changeFavorite()}
		disabled={inProgress}
	>
		{#if log.favorite}
			Unfavorite
		{:else}
			Favorite
		{/if}
	</button>
{/snippet}

{#snippet visibilityButton(action: keyof typeof visibilities)}
	<button
		class="btn btn-outline btn-neutral w-full max-w-xs"
		onclick={() => changeVisibility(action)}
		disabled={log.visibility == action || inProgress}
	>
		{visibilities[action]}
	</button>
{/snippet}
