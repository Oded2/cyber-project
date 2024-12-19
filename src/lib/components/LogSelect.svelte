<script lang="ts">
	import { capitalizeFirstLetter, format, toInputElement } from '$lib';

	let {
		values,
		name,
		displayName = format(name),
		allowOther = true,
		value: originalValue = '',
		min = 0,
		max = 100
	}: {
		values: string[];
		name: string;
		allowOther?: boolean;
		value?: string;
		min?: number;
		max?: number;
		displayName?: string;
	} = $props();

	const uniqueId = name + 'other';
	// Creating a unique id to the "other" option without having effect on other elements on the page
	let errorMessage: string = $state('');
	let other: boolean = $state(false);

	function otherInputChange(event: Event) {
		const value = toInputElement(event).value;
		if (value.length > max) {
			// Checks that the value isn't too long
			errorMessage = `Field must be at most ${max} chracters`;
			return;
		}
		errorMessage = '';
		// Resets the error message
		const selectInput = document.getElementById(name) as HTMLSelectElement;
		const otherOption = document.getElementById(uniqueId) as HTMLOptionElement;
		const changeEvent = new Event('change', { bubbles: true, cancelable: true });
		// Creates a change event in order to trigger onchnage for the select element
		// bubbles: Allows parent to listen for events if true
		// cancelable: Allows the event to be prevented, usually with preventDefault
		otherOption.value = value;
		otherOption.selected = true;
		// Changes the value of `the other option to the user's input
		selectInput.dispatchEvent(changeEvent);
	}
</script>

<div class="join w-full">
	<select
		onchange={(e) => {
			const select = toInputElement(e);
			const value = select.value;
			other = !values.includes(value);
			// Will only show text input if other is selected
		}}
		{name}
		class="join-item select select-bordered w-full"
		class:max-w-40={other}
	>
		<option disabled value={originalValue.length > 0 ? originalValue : values[0]} selected
			>{displayName}</option
		>
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
			placeholder={displayName}
			onchange={otherInputChange}
			oninput={(e) => {
				// Reset the error message
				const value = toInputElement(e).value;
				if (value.length <= max) errorMessage = '';
			}}
		/>
	{/if}
</div>
{#if errorMessage.length > 0}
	<span class="px-4 text-error">{errorMessage}</span>
{/if}
