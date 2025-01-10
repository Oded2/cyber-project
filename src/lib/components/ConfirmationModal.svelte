<script lang="ts">
	import Modal from './Modal.svelte';

	const {
		id,
		message = '',
		text = '',
		onconfirmation
	}: {
		id: string;
		message?: string;
		text?: string;
		onconfirmation: () => Promise<void> | void;
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
		const modal = document.getElementById(id) as HTMLDialogElement;
		onclose();
		modal.close();
	}
</script>

<Modal {id} {onclose}>
	<div class="card-title mb-2 border-b-2 pb-2">Are you sure you want to do this?</div>
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
			<button
				type="button"
				onclick={handleSubmit}
				class="btn btn-primary"
				disabled={value !== text || inProgress}>Confirm</button
			>
		</div>
	</form>
</Modal>
