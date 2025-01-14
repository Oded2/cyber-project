<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Modal from './Modal.svelte';
	import { addParams, formatDate, hrefs } from '$lib';
	import { page } from '$app/stores';

	const { id, log, supabase }: { id: string; log: Log; supabase: SupabaseClient } = $props();
	// Get the current URL
	const pageUrl = $page.url;
	const visibilities = {
		private: 'Privatize',
		public: 'Publicize',
		unlisted: 'Unlist'
	};

	// This is a variable that stores any visibility changes so the user doesn't have to reload
	let visibilityCache: { id: number; visibility: keyof typeof visibilities }[] = $state([]);

	// Variable to disable the buttons while an asynchronous function is happening
	let inProgress: boolean = $state(false);

	async function changeVisibility(action: keyof typeof visibilities) {
		inProgress = true;
		await supabase.from('logs').update({ visibility: action }).eq('id', log.id);
		inProgress = false;
		const exists = visibilityCache.some((item) => item.id == log.id);
		if (exists)
			visibilityCache = visibilityCache.map((item) =>
				item.id == log.id ? { ...item, visibility: action } : item
			);
		else visibilityCache = [...visibilityCache, { id: log.id, visibility: action }];
	}

	function determineVisibility(): keyof typeof visibilities {
		for (const item of visibilityCache) if (item.id == log.id) return item.visibility;
		return log.visibility;
	}
</script>

<Modal {id} title={`Options for log from ${formatDate(log.dep_time)}`}>
	<div class="flex flex-col items-center gap-4">
		{@render visibilityButton('private')}
		{@render visibilityButton('public')}
		{@render visibilityButton('unlisted')}

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

{#snippet visibilityButton(action: keyof typeof visibilities)}
	<button
		class="btn btn-outline btn-neutral w-full max-w-xs"
		onclick={() => changeVisibility(action)}
		disabled={determineVisibility() === action || inProgress}
	>
		{visibilities[action]}
	</button>
{/snippet}
