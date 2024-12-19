<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		name,
		value = '',
		min = 0,
		max = 50,
		required = false,
		placeholder = 'Type Here',
		displayName = format(name)
	}: {
		name: string;
		value?: string;
		min?: number;
		max?: number;
		required?: boolean;
		placeholder?: string;
		displayName?: string;
	} = $props();

	let errorMessage: string = $state('');

	function handleChange(e: Event) {
		const originalValue = toInputElement(e).value;
		const value = parseInt(originalValue);
		if (originalValue.length > 0 && isNaN(value)) {
			// Gives an error if the value is a number, but checks that the value isn't
			// empty first
			errorMessage = 'Value must be a number.';
		} else if (value < min) errorMessage = `Minimum value is ${min.toLocaleString()}.`;
		else if (value > max) errorMessage = `Maximum value is ${max.toLocaleString()}`;
		else errorMessage = '';
	}
</script>

<label class="flex w-full max-w-xs flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<input
		type="number"
		{value}
		onchange={handleChange}
		{placeholder}
		class="input input-sm input-bordered w-full max-w-xs py-5"
		{min}
		{max}
		{required}
		{name}
	/>

	{#if !required}
		<div class="label"><span class="label-text-alt font-light italic">Optional</span></div>
	{/if}
	{#if errorMessage.length > 0}
		<span class="px-3 text-sm text-error">{errorMessage}</span>
	{/if}
</label>
