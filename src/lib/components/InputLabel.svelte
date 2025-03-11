<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<label class="input input-ghost rounded-md border-1 border-gray-300! font-medium outline-hidden!">
	{@render children()}
</label>
