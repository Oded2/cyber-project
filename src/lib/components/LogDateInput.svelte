<script lang="ts">
	import { format, toInputElement, formatDateTime, formatDate, maxDate, minDate } from '$lib';
	import { onMount } from 'svelte';

	// Get the current date
	const today = new Date();

	const {
		name,
		value = formatDateTime(today),
		min = formatDateTime(minDate),
		max = formatDateTime(maxDate),
		required = false,
		placeholder = 'Type Here',
		displayName = format(name),
		attributeChange
	}: {
		name: string;
		value?: string;
		min?: string;
		max?: string;
		required?: boolean;
		placeholder?: string;
		displayName?: string;
		attributeChange: { id: 'dep_time' | 'des_time'; attribute: 'min' | 'max' };
	} = $props();

	// 'otherInput' is the opposite of the current one
	// For example, if this input is 'dep_time' then 'otherInput' is 'des_time'
	let otherInput: HTMLInputElement;
	onMount(() => {
		// This defines 'otherInput' but only after the document loads
		otherInput = document.getElementById(attributeChange.id) as HTMLInputElement;
	});

	let errorMessage: string = $state('');

	function handleChange(e: Event): void {
		// Simply to assist the user, does not perform any client-side validation
		const value = new Date(toInputElement(e).value);
		if (value > maxDate) {
			errorMessage = `Date cannot be after ${formatDate(maxDate)}`;
		} else if (value < minDate) {
			errorMessage = `Date cannot be before ${formatDate(minDate)}`;
		} else {
			errorMessage = '';
		}
		otherInput.setAttribute(attributeChange.attribute, formatDateTime(value));
	}
	function sync(): void {
		// Function that synchronizes the current input to the other one
		const input = document.getElementById(name) as HTMLInputElement;
		input.value = otherInput.value;
	}
</script>

<label class="flex w-full flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<div class="flex gap-1">
		<input
			{name}
			id={name}
			type="datetime-local"
			{value}
			onchange={handleChange}
			{placeholder}
			class="input input-sm input-bordered w-full py-5"
			{min}
			{max}
			{required}
		/>
		<button type="button" onclick={sync} class="btn">Sync</button>
	</div>
	<div class="label">
		<span class="label-text-alt font-light italic">Relative to local timezone</span>
	</div>
	{#if errorMessage.length > 0}
		<span class="text-error px-3 text-sm">{errorMessage}</span>
	{/if}
</label>
