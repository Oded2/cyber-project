<script lang="ts">
	import { fly } from 'svelte/transition';

	let { visible, message }: { visible: boolean; message: string } = $props();
</script>

{#if visible}
	<div
		transition:fly={{ duration: 1000, y: -200 }}
		role="alert"
		class="alert alert-error absolute bottom-5 left-5 max-w-xs"
	>
		<i class="fa-solid fa-x"></i>
		<span>{message}</span>
	</div>
{/if}
