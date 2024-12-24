<script lang="ts">
	import { format } from '$lib';

	const {
		values,
		name,
		displayName = format(name)
	}: {
		values: { display: string; id: string }[];
		name: string;
		min?: number;
		max?: number;
		displayName?: string;
	} = $props();

	let errorMessage: string = $state('');
</script>

<label class="flex w-full flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<select {name} class=" select select-bordered w-full">
		{#each values as value, index}
			<!-- Index == 0 ensures thsat the first option is automatically selected -->
			<option selected={index == 0} value={value.id}>{value.display}</option>
		{/each}
	</select>
	{#if errorMessage.length > 0}
		<span class="px-3 text-sm text-error">{errorMessage}</span>
	{/if}
</label>
