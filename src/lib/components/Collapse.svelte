<script lang="ts">
	import type { Snippet } from 'svelte';

	const { title, children }: { title: string; children: Snippet } = $props();
	let checked: boolean = $state(false);
</script>

<div class="collapse max-w-xs">
	<input type="checkbox" bind:checked />
	<div class="collapse-title text-xl font-medium">
		{title} <i class="fa-solid fa-caret-down transition" class:rotate-180={checked}></i>
	</div>
	<div class="collapse-content">
		{@render children()}
	</div>
</div>
