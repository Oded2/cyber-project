<script lang="ts">
	import type { Snippet } from 'svelte';

	const {
		validatorText,
		disclaimer,
		children
	}: { validatorText?: string; disclaimer?: string; children: Snippet } = $props();
</script>

<div>
	<label class="input w-full" class:validator={validatorText}>
		{@render children()}
		{#if disclaimer}
			<div class="tooltip cursor-default" data-tip={disclaimer}>
				<i class="fa-solid fa-circle-exclamation"></i>
			</div>
		{/if}
	</label>
	{#if validatorText}
		<p class="validator-hint">
			{validatorText}
		</p>
	{/if}
</div>
