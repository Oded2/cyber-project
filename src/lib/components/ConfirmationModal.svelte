<script lang="ts">
	import { closeMOdal } from '$lib';
	import Modal from './Modal.svelte';

	const {
		id,
		title = 'Are you sure you want to do this?',
		message = '',
		text = '',
		href = '',
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
	let inProgress: boolean = $state(false);

	function onclose(): void {
		value = '';
	}
	async function handleSubmit() {
		inProgress = true;
		await onconfirmation();
		inProgress = false;
		onclose();
		closeMOdal(id);
	}
</script>

<Modal {id} {title} {onclose}>
	{#if message.length > 0}
		<div class="mb-4 text-error">{message}</div>
	{/if}
	{#if text.length > 0}
		<label class="mb-4 flex w-full flex-col">
			<span class="mb-2 px-2 text-sm">{`Type "${text}" to confirm`}</span>
			<input type="text" bind:value class="input input-sm input-bordered w-full py-5" />
		</label>
	{/if}
	<form method="dialog" onsubmit={onclose}>
		<div class="flex justify-end gap-2">
			<button type="submit" class="btn btn-secondary">Cancel</button>
			{#if href.length > 0}
				<a {href} class="btn btn-primary">Confirm</a>
			{:else}
				<button
					type="button"
					onclick={handleSubmit}
					class="btn btn-primary"
					disabled={value !== text || inProgress}>Confirm</button
				>
			{/if}
		</div>
	</form>
</Modal>
