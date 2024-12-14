<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		maxLength = 100,
		required = false,
		placeholder,
		name,
		id,
		value = ''
	}: {
		maxLength?: number;
		required?: boolean;
		placeholder: string;
		name: string;
		id: string;
		value?: string;
	} = $props();

	let errorMessage: string = $state('');

	function validate(event: Event) {
		// Display's an error for the user
		const length = toInputElement(event).value.length;
		errorMessage = '';
		if (length > maxLength) errorMessage = `${format(name)} cannot exceed ${maxLength} characters.`;
	}
</script>

<div>
	<label class="input input-bordered flex items-center gap-2">
		{format(name)}
		{#if !required}
			<span class=" text-sm font-light italic">(optional)</span>
		{/if}
		<input
			{value}
			oninput={(e) => toInputElement(e).parentElement?.classList.remove('input-error')}
			onblur={validate}
			type="text"
			{name}
			class="grow"
			{placeholder}
			maxlength={maxLength}
			{id}
		/>
	</label>

	{#if errorMessage.length > 0}
		<span class="px-4 text-error">{errorMessage}</span>
	{/if}
</div>
