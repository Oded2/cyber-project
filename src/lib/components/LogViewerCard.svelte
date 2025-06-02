<script lang="ts">
	import type { Snippet } from 'svelte';

	const { title, image, children }: { title: string; image?: string; children: Snippet } = $props();
</script>

<div class="card bg-primary-content col-auto shadow transition-transform hover:-translate-y-1">
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		{@render children()}
	</div>
	{#if image}
		<figure><img src={image} alt={title} /></figure>
	{/if}
</div>
