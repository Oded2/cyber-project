<script lang="ts">
	import type { Snippet } from 'svelte';

	let { href, children }: { href: string; children: Snippet } = $props();
</script>

<a {href} class="btn mx-auto mb-4 w-44 max-w-xs px-5">
	{@render children()}
</a>
