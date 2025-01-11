<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		title,
		image = '',
		children
	}: { title: string; image?: string; children: Snippet } = $props();
</script>

<div class="card col-auto bg-primary-content transition hover:shadow-lg">
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		{@render children()}
	</div>
	{#if image.length > 0}
		<figure><img src={image} alt={title} /></figure>
	{/if}
</div>
