<script lang="ts">
	import { capitalizeFirstLetter, format, toInputElement } from '$lib';

	const {
		values,
		name,
		id,
		allowOther = true
	}: {
		values: string[];
		name: string;
		id: string;
		allowOther?: boolean;
	} = $props();

	const uniqueId = name + 'other';
	// Creating a unique id to the "other" option without having effect on other elements on the page

	let other: boolean = $state(false);
</script>

<div class="join w-full">
	<select
		onchange={(e) => {
			const select = toInputElement(e);
			const value = select.value;
			other = !values.includes(value);
			// Will only show text input if other is selected
		}}
		{id}
		{name}
		class="join-item select select-bordered w-full"
		class:max-w-40={other}
	>
		<option disabled value={values[0]} selected>{format(name)}</option>
		{#each values as value}
			<option {value}>{capitalizeFirstLetter(value)}</option>
		{/each}
		{#if allowOther}
			<option value="other" id={uniqueId}>Other</option>
		{/if}
	</select>
	{#if other}
		<input
			type="text"
			class="input join-item input-bordered w-full"
			placeholder={format(name)}
			onchange={(e) => {
				const input = toInputElement(e);
				const selectInput = document.getElementById(id) as HTMLSelectElement;
				const otherOption = document.getElementById(uniqueId) as HTMLOptionElement;
				const changeEvent = new Event('change', { bubbles: true, cancelable: true });
				// Creates a change event in order to trigger onchnage for the select element
				// bubbles: Allows parent to listen for events if true
				// cancelable: Allows the event to be prevented, usually with preventDefault
				otherOption.value = input.value;
				otherOption.selected = true;
				// Changes the value of the other option to the user's input
				selectInput.dispatchEvent(changeEvent);
			}}
		/>
	{/if}
</div>
