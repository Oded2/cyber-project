<script lang="ts">
	import type { Snippet } from 'svelte';

	const { title, children }: { title: string; children: Snippet } = $props();
</script>

<div class="card bg-primary-content transition hover:shadow-lg">
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		{@render children()}
	</div>
</div>
