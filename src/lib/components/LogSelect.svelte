<script lang="ts">
	import { format } from '$lib';

	let {
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

	const uniqueId = name + 'other';
	// Creating a unique id to the "other" option without having effect on other elements on the page
	let errorMessage: string = $state('');
</script>

<div class="join w-full">
	<select {name} class="join-item select select-bordered w-full max-w-xs">
		<option disabled value={values[0]} selected>{displayName}</option>
		{#each values as value}
			<option value={value.id}>{value.display}</option>
		{/each}
	</select>
</div>
{#if errorMessage.length > 0}
	<span class="px-4 text-error">{errorMessage}</span>
{/if}
