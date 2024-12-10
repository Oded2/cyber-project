<script lang="ts">
	import { format, toInputElement } from '$lib';

	const { name, required, id }: { name: string; required?: boolean; id: string } = $props();
	const year = new Date().getFullYear();

	let errorMessage: string = $state('');

	function validate(e: Event) {
		const originalValue = toInputElement(e).value;
		const value = parseInt(originalValue);
		errorMessage = '';
		if (originalValue.length > 0 && isNaN(value)) errorMessage = 'Value must be a number.';
		else if (value < 1903) errorMessage = 'Minimum year is 1903.';
		else if (value > year) errorMessage = 'Value cannot be in the future.';
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
			min="1903"
			max={year}
			{id}
		/>
	</label>
	{#if errorMessage.length > 0}
		<span class="px-4 text-error">{errorMessage}</span>
	{/if}
</div>
