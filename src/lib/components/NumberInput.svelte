<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		name,
		id,
		min,
		max,
		placeholder,
		value = ''
	}: {
		name: string;

		id: string;
		min: number;
		max: number;
		placeholder?: string;
		value?: string;
	} = $props();

	let errorMessage: string = $state('');

	function validate(e: Event) {
		const originalValue = toInputElement(e).value;
		const value = parseInt(originalValue);
		errorMessage = '';
		if (originalValue.length > 0 && isNaN(value)) {
			// Gives an error if the value is a number, but checks that the value isn't
			// empty first
			errorMessage = 'Value must be a number.';
		} else if (value < min) errorMessage = `Minimum value is ${min}.`;
		else if (value > max) errorMessage = `Maximum value is ${max}`;
	}
</script>

<div>
	<label class="input input-bordered flex items-center gap-2">
		{format(name)}
		<input
			{value}
			oninput={(e) => toInputElement(e).parentElement?.classList.remove('input-error')}
			onchange={validate}
			type="text"
			{name}
			class="grow"
			{id}
			placeholder={placeholder ?? ''}
		/>
	</label>
	{#if errorMessage.length > 0}
		<span class="px-4 text-error">{errorMessage}</span>
	{/if}
</div>
