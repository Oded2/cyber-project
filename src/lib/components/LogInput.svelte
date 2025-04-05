<script lang="ts">
	import type { EventHandler, FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import { format } from '$lib';

	const {
		id,
		min,
		max,
		required,
		placeholder,
		name,
		displayName = format(name),
		value,
		type = 'text',
		validatorText,
		autocomplete,
		autocorrect,
		noValidation,
		disclaimer,
		oninput,
		onchange
	}: {
		id?: string;
		min?: number;
		max?: number;
		required?: boolean;
		placeholder?: string;
		displayName?: string;
		name: string;
		value?: string;
		type?: HTMLInputTypeAttribute;
		validatorText?: string;
		autocomplete?: FullAutoFill;
		autocorrect?: 'on' | 'off';
		noValidation?: boolean;
		disclaimer?: string;
		oninput?: EventHandler<Event, HTMLInputElement>;
		onchange?: EventHandler<Event, HTMLInputElement>;
	} = $props();

	let finalValidatorText = $state('Field cannot be empty');
	if (validatorText) finalValidatorText = validatorText;
	else if (min && max)
		finalValidatorText = `Input must be between ${min.toLocaleString()} and ${max.toLocaleString()}${type === 'text' ? ' characters long' : undefined}.`;
</script>

<InputLabel validatorText={noValidation ? undefined : finalValidatorText} {disclaimer}>
	{displayName}
	{#if !required}
		<span class="font-light italic">(optional)</span>
	{/if}
	<input
		{id}
		{value}
		{type}
		{name}
		class="flex items-center"
		{placeholder}
		min={type === 'number' ? min : undefined}
		max={type === 'number' ? min : undefined}
		minlength={type === 'text' ? min : undefined}
		maxlength={type === 'text' ? max : undefined}
		{autocomplete}
		{autocorrect}
		{required}
		{oninput}
		{onchange}
	/>
</InputLabel>
