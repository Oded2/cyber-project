<script lang="ts">
	import Modal from './Modal.svelte';

	const {
		id,
		message = '',
		onconfirmation
	}: { id: string; message?: string; onconfirmation: () => void } = $props();
</script>

<Modal {id}>
	<div class="card-title mb-2 border-b-2 pb-2">Are you sure you want to do this?</div>
	{#if message.length > 0}
		<div class="mb-4 text-error">{message}</div>
	{/if}
	<form method="dialog">
		<div class="flex justify-end gap-2">
			<button type="submit" class="btn btn-secondary">Cancel</button>
			<button type="submit" onclick={onconfirmation} class="btn btn-primary">Confirm</button>
		</div>
	</form>
</Modal>
