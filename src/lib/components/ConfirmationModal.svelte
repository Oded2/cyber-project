<script lang="ts">
	import { closeModal, handleButtonAwait } from '$lib';
	import type { EventHandler } from 'svelte/elements';
	import Modal from './Modal.svelte';

	const {
		id,
		title = 'Are you sure you want to do this?',
		message,
		text,
		href,
		onconfirmation = () => {}
	}: {
		id: string;
		title?: string;
		message?: string;
		text?: string;
		href?: string;
		onconfirmation?: () => Promise<void> | void;
	} = $props();

	let value: string = $state('');

	const btnDisabled: boolean = $derived(!!text && value !== text);

	const handleConfirmation: EventHandler<MouseEvent, HTMLButtonElement> = async (e) => {
		await handleButtonAwait(e.currentTarget, onconfirmation, document, true);
		onclose();
		closeModal(id);
	};

	function onclose(): void {
		value = '';
	}
</script>

<Modal {id} {title} {onclose}>
	{#if message}
		<div class="text-error mb-4">{message}</div>
	{/if}
	{#if text}
		<label class="mb-4 flex w-full flex-col">
			<span class="mb-2 px-2 text-sm">{`Type "${text}" to confirm`}</span>
			<input
				type="text"
				bind:value
				class="input input-sm input-bordered w-full py-5"
				autocorrect="off"
				spellcheck="false"
			/>
		</label>
	{/if}
	<form method="dialog" onsubmit={onclose}>
		<div class="flex justify-end gap-2">
			<button type="submit" class="btn btn-secondary">Cancel</button>
			{#if href}
				<a {href} class="btn btn-primary" class:btn-disabled={btnDisabled}>Confirm</a>
			{:else}
				<button
					type="button"
					onclick={handleConfirmation}
					class="btn btn-primary"
					disabled={btnDisabled}
				>
					Confirm
				</button>
			{/if}
		</div>
	</form>
</Modal>
