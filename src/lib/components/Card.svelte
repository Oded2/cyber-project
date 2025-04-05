<script lang="ts">
	import type { Snippet } from 'svelte';

	const { title, children }: { title?: string; children: Snippet } = $props();
</script>

<div class="card mx-auto max-w-md p-5 shadow-lg">
	{#if title}
		<h2 class="card-title mb-2">{title}</h2>
	{/if}
	{@render children()}
</div>
