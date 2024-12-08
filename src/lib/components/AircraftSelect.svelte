<script lang="ts">
	const { values, name }: { values: string[]; name: string } = $props();
</script>

<select name="type" class="select select-bordered w-full">
	<option disabled selected
		>{name
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}</option
	>
	{#each values as value}
		<option {value}>{value}</option>
	{/each}
</select>
