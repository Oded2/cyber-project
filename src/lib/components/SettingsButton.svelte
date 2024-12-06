<script lang="ts">
	import type { Snippet } from 'svelte';

	let { active, children, onclick }: { active: boolean; children: Snippet; onclick: () => void } =
		$props();
</script>

<button class="btn btn-outline btn-info justify-start" class:btn-active={active} {onclick}>
	{@render children()}
</button>
