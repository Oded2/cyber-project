<script lang="ts">
	import type { Snippet } from 'svelte';

	const { automaticClose = false, children }: { automaticClose?: boolean; children: Snippet } =
		$props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<ul
	tabindex="0"
	class="menu dropdown-content menu-sm z-1 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-sm"
>
	{#if automaticClose}
		<form>
			{@render children()}
		</form>
	{:else}
		{@render children()}
	{/if}
</ul>
