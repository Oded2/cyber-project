<script lang="ts">
	import type { Snippet } from 'svelte';

	const { title, image, children }: { title: string; image?: string; children: Snippet } = $props();
</script>

<div class="card bg-primary-content col-auto transition hover:shadow-lg">
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		{@render children()}
	</div>
	{#if image}
		<figure><img src={image} alt={title} /></figure>
	{/if}
</div>
