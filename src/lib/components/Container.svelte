<script lang="ts">
	import type { Snippet } from 'svelte';

	const { margin = true, children }: { margin?: boolean; children: Snippet } = $props();
</script>

<main class="container mx-auto" class:my-10={margin}>
	{@render children()}
</main>
