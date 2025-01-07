<script lang="ts">
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();
</script>

<div class="sticky bottom-0 left-0 p-5">
	{@render children()}
</div>
