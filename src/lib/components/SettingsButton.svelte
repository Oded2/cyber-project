<script lang="ts">
	import type { Snippet } from 'svelte';

	let { active, children }: { active: string; children: Snippet } = $props();
</script>

<button class="btn justify-start" class:btn-active={active}>
	{@render children()}
</button>
