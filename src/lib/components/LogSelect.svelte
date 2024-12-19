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

<!-- <div class="w-full">
	<select {name} class=" select select-bordered w-full max-w-xs">
		<option disabled value={values[0]} selected>{displayName}</option>
		{#each values as value}
			<option value={value.id}>{value.display}</option>
		{/each}
	</select>
</div> -->

<label class="flex w-full max-w-xs flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<select {name} class=" select select-bordered w-full max-w-xs">
		<option disabled value={values[0]} selected>{displayName}</option>
		{#each values as value}
			<option value={value.id}>{value.display}</option>
		{/each}
	</select>
	{#if errorMessage.length > 0}
		<span class="px-3 text-sm text-error">{errorMessage}</span>
	{/if}
</label>
