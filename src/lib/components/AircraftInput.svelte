<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		maxLength = 100,
		required = false,
		placeholder,
		name,
		id
	}: {
		maxLength?: number;
		required?: boolean;
		placeholder: string;
		name: string;
		id: string;
	} = $props();

	let errorMessage: string = $state('');

	function validate(event: Event) {
		const element = toInputElement(event);
		const value = element.value;
		const length = value.length;
		errorMessage = '';
		if (length > maxLength) errorMessage = `${format(name)} cannot exceed ${maxLength} characters.`;
		if (length == 0) errorMessage = `${format(name)} cannot be empty`;
	}
</script>

<div>
	<label class="input input-bordered flex items-center gap-2">
		{format(name)}
		<input
			onblur={validate}
			type="text"
			{name}
			class="grow"
			{placeholder}
			{required}
			maxlength={maxLength}
			{id}
		/>
	</label>
	{#if errorMessage.length > 0}
		<span class="px-4 text-error">{errorMessage}</span>
	{/if}
</div>
