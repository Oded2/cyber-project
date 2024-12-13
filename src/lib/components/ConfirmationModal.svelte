<script lang="ts">
	import Modal from './Modal.svelte';

	const { id, onconfirmation }: { id: string; onconfirmation: () => void } = $props();
</script>

<Modal {id}>
	<div class="card-title mb-2 border-b-2 pb-2">Are you sure you want to do this?</div>
	<form method="dialog">
		<div class="flex justify-end gap-2">
			<button type="submit" class="btn btn-secondary">Cancel</button>
			<button type="submit" onclick={onconfirmation} class="btn btn-primary">Confirm</button>
		</div>
	</form>
</Modal>
