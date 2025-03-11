<script lang="ts">
	import type { Snippet } from 'svelte';

	const { validatorText, children }: { validatorText?: string; children: Snippet } = $props();
</script>

<div>
	<label class="input w-full" class:validator={validatorText}>
		{@render children()}
	</label>
	{#if validatorText}
		<p class="validator-hint">
			{validatorText}
		</p>
	{/if}
</div>
