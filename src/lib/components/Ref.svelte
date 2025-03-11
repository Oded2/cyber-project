<script lang="ts">
	import Float from './Float.svelte';

	const { ref }: { ref: string } = $props();
</script>

{#if ref.length > 0}
	<Float>
		<a href={ref} aria-label="Back" class="btn shadow-sm"><i class="fa-solid fa-arrow-left"></i></a>
	</Float>
{/if}
