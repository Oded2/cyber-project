<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import Modal from './Modal.svelte';
	import { addParams, closeModal, formatDate, hrefs, showModal } from '$lib';
	import { page } from '$app/state';
	import ConfirmationModal from './ConfirmationModal.svelte';

	const {
		id,
		log = $bindable(),
		originalLogs,
		supabase,
		ondelete
	}: {
		id: string;
		log: Log;
		originalLogs: Log[];
		supabase: SupabaseClient;
		ondelete: () => void;
	} = $props();
	// Get the current URL
	const pageUrl = page.url;
	const visibilities = {
		private: 'Privatize',
		public: 'Publicize',
		unlisted: 'Unlist'
	};

	// This is a unique id for the confirmation modal for deleting logs
	const uniqueId = `delete${log.id}`;

	// Variable to disable the buttons while an asynchronous function is happening
	let inProgress: boolean = $state(false);

	async function changeVisibility(action: keyof typeof visibilities) {
		inProgress = true;
		await supabase.from('logs').update({ visibility: action }).eq('id', log.id);
		inProgress = false;
		log.visibility = action;
		originalLogs.find((item) => item.id == log.id)!.visibility = action;
	}
	async function changeFavorite() {
		// Since favorite is simply a toggle, the new value will simply be the opposite of the old one
		const action = !log.favorite;
		inProgress = true;
		await supabase.from('logs').update({ favorite: action }).eq('id', log.id);
		inProgress = false;
		log.favorite = action;
		originalLogs.find((item) => item.id == log.id)!.favorite = action;
	}
	async function handleDelete(): Promise<void> {
		await supabase.from('logs').delete().eq('id', log.id);
		const index = originalLogs.findIndex((item) => item.id == log.id);
		originalLogs.splice(index, 1);
		ondelete();
	}
</script>

<Modal {id} title={`Options for log from ${formatDate(log.dep_time)}`}>
	<div class="flex flex-col items-center gap-4">
		{@render visibilityButton('private')}
		{@render visibilityButton('public')}
		{@render visibilityButton('unlisted')}
		{@render favoriteButton()}
		<a
			href={addParams(hrefs.logView.replace('slug', log.id.toString()), {
				ref: pageUrl.toString()
			})}
			class="btn btn-primary w-full max-w-xs"
			class:btn-disabled={inProgress}>View</a
		>
		<!-- When this button is clicked, it closes the current modal and opens -->
		<!-- a new confirmation modal ensuring the user is certain about his choice -->
		<button
			class="btn btn-outline btn-error w-full max-w-xs"
			onclick={() => {
				closeModal(id);
				showModal(uniqueId);
			}}>Delete</button
		>
	</div>
</Modal>

<ConfirmationModal id={uniqueId} onconfirmation={handleDelete}></ConfirmationModal>

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
