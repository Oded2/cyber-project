<script lang="ts">
	import { format, toInputElement } from '$lib';

	const {
		name,
		value = '',
		minlength = 0,
		maxlength = 50,
		required = false,
		placeholder = 'Type Here',
		displayName = format(name),
		autocorrect = 'on'
	}: {
		name: string;
		value?: string;
		minlength?: number;
		maxlength?: number;
		required?: boolean;
		placeholder?: string;
		displayName?: string;
		autocorrect?: 'on' | 'off';
	} = $props();

	let errorMessage: string = $state('');

	function handleChange(e: Event): void {
		// Simply to assist the user, does not perform any client-side validation
		const length = toInputElement(e).value.length;
		if (length > maxlength) {
			errorMessage = `Length cannot exceed ${maxlength} characters`;
		} else if (length < minlength) {
			errorMessage = `Length must be at least ${minlength} characters`;
		} else if (required && length == 0) {
			errorMessage = 'Field cannot be empty';
		} else {
			errorMessage = '';
		}
	}
</script>

<label class="flex w-full flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<input
		type="text"
		{value}
		onchange={handleChange}
		{placeholder}
		{autocorrect}
		class="input input-sm input-bordered w-full py-5"
		{minlength}
		{maxlength}
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
