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
</script>

<div class="join w-full">
	<select {name} class="join-item select select-bordered w-full max-w-xs">
		<option disabled value={values[0]} selected>{displayName}</option>
		{#each values as value}
			<option value={value.id}>{value.display}</option>
		{/each}
	</select>
</div>
