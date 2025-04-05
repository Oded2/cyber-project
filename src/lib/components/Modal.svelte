<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		id,
		title,
		onclose = () => {},
		children
	}: { id: string; title?: string; onclose?: () => void; children: Snippet } = $props();
</script>

<dialog {id} class="modal">
	<div class="modal-box">
		{#if title}
			<div class="card-title mb-3 border-b-2 pb-3">{title}</div>
		{/if}
		{@render children()}
	</div>
	<form method="dialog" class="modal-backdrop" onsubmit={onclose}>
		<button>close</button>
	</form>
</dialog>
