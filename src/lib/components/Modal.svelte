<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		id,
		onclose = () => {},
		children
	}: { id: string; onclose?: () => void; children: Snippet } = $props();
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		{@render children()}
	</div>
	<form method="dialog" class="modal-backdrop" onsubmit={onclose}>
		<button>close</button>
	</form>
</dialog>
