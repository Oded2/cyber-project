<script lang="ts">
	import { format } from '$lib';

	const {
		values,
		name,
		onchange = () => {},
		allowOther = true
	}: { values: string[]; name: string; onchange?: () => void; allowOther?: boolean } = $props();

	const uniqueId = name + 'other';

	let other: boolean = $state(false);
</script>

<div class="join w-full">
	<select
		onchange={(e) => {
			const select = e.target as HTMLSelectElement;
			const value = select.value;
			other = !values.includes(value);
			// Will only show text input if other is selected
			onchange();
		}}
		id={name}
		{name}
		class="join-item select select-bordered w-full"
		class:max-w-40={other}
	>
		<option disabled selected>{format(name)}</option>
		{#each values as value}
			<option {value}>{value}</option>
		{/each}
		{#if allowOther}
			<option value="other" id={uniqueId}>Other</option>
		{/if}
	</select>
	{#if other}
		<input
			name="type"
			type="text"
			class="input join-item input-bordered w-full"
			placeholder={format(name)}
			onchange={(e) => {
				const input = e.target as HTMLInputElement;
				const selectInput = document.getElementById(name) as HTMLSelectElement;
				const otherOption = document.getElementById(uniqueId) as HTMLOptionElement;
				const changeEvent = new Event('change', { bubbles: true, cancelable: true });
				otherOption.value = input.value;
				otherOption.selected = true;
				selectInput.dispatchEvent(changeEvent);
			}}
		/>
	{/if}
</div>
