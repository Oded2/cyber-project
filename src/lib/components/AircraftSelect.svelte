<script lang="ts">
	import { format, toInputElement } from '$lib';

	let {
		values,
		name,
		id,
		allowOther,
		originalValue
	}: {
		values: SelectValues;
		name: string;
		id?: string;
		allowOther?: boolean;
		originalValue?: string;
	} = $props();

	const max: number = 100;
	let errorMessage: string = $state('');
	let other: boolean = $state(false);
	let selectInput: HTMLSelectElement;
	let otherOption: HTMLOptionElement;
	let titleOption: HTMLOptionElement;

	function otherInputChange(event: Event) {
		const value = toInputElement(event).value;
		if (value.length > max) {
			// Checks that the value isn't too long
			errorMessage = `Field must be at most ${max} chracters`;
			return;
		}
		errorMessage = '';
		// Resets the error message
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

<div class="flex w-full gap-2">
	<select
		bind:this={selectInput}
		onchange={(e) => {
			titleOption.disabled = true;
			const value = e.currentTarget.value;
			other = !values.some((val) => val.id === value);
			// Will only show text input if other is selected
		}}
		{id}
		{name}
		class="select w-full"
		class:max-w-40={other}
	>
		<option bind:this={titleOption} value={originalValue ? originalValue : values[0].id} selected>
			{format(name)}</option
		>
		{#each values as value}
			<option value={value.id}>{value.display}</option>
		{/each}
		<option bind:this={otherOption} value="other" disabled={!allowOther}>Other</option>
	</select>
	{#if other}
		<input
			type="text"
			class="input join-item w-full"
			placeholder={format(name)}
			onchange={otherInputChange}
			oninput={(e) => {
				// Reset the error message
				const value = toInputElement(e).value;
				if (value.length <= max) errorMessage = '';
			}}
		/>
	{/if}
</div>
<p class="validator-hint invisible">Invisible</p>

{#if errorMessage.length > 0}
	<span class="text-error px-4">{errorMessage}</span>
{/if}
