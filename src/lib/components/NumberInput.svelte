<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		name,
		required,
		id,
		min,
		max,
		placeholder
	}: {
		name: string;
		required?: boolean;
		id: string;
		min: number;
		max: number;
		placeholder?: string;
	} = $props();

	let errorMessage: string = $state('');

	function validate(e: Event) {
		const originalValue = toInputElement(e).value;
		const value = parseInt(originalValue);
		errorMessage = '';
		if (originalValue.length > 0 && isNaN(value)) errorMessage = 'Value must be a number.';
		else if (value < min) errorMessage = `Minimum value is ${min}.`;
		else if (value > max) errorMessage = `Maximum value is ${max}`;
	}
</script>

<div>
	<label class="input input-bordered flex items-center gap-2">
		{format(name)}
		<input
			oninput={(e) => toInputElement(e).parentElement?.classList.remove('input-error')}
			onblur={validate}
			type="number"
			{name}
			class="grow"
			{required}
			{min}
			{max}
			{id}
			placeholder={placeholder ?? ''}
		/>
	</label>
	{#if errorMessage.length > 0}
		<span class="px-4 text-error">{errorMessage}</span>
	{/if}
</div>
