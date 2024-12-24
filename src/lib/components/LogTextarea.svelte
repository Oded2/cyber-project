<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		name,
		value = '',
		minlength = 0,
		maxlength = 50,
		required = false,
		placeholder = 'Type Here',
		displayName = format(name)
	}: {
		name: string;
		value?: string;
		minlength?: number;
		maxlength?: number;
		required?: boolean;
		placeholder?: string;
		displayName?: string;
	} = $props();

	let errorMessage: string = $state('');

	function handleChange(e: Event): void {
		const length = toInputElement(e).value.length;
		if (length > maxlength) {
			errorMessage = `Length cannot exceed ${maxlength}`;
		} else if (length < minlength) {
			errorMessage = `Length must be at least ${minlength} characters`;
		} else {
			errorMessage = '';
		}
	}
</script>

<label class="flex w-full flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<textarea
		onchange={handleChange}
		class="textarea textarea-bordered resize-none"
		rows="5"
		{placeholder}
		{name}
		{minlength}
		{maxlength}
		{required}
		{value}
	></textarea>
	{#if !required}
		<div class="label">
			<span class="label-text-alt font-light italic">Optional</span>
		</div>
	{/if}
	{#if errorMessage.length > 0}
		<span class="px-3 text-sm text-error">{errorMessage}</span>
	{/if}
</label>
