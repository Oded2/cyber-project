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
		autocomplete,
		autocorrect,
		noValidation,
		oninput
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
		oninput?: EventHandler<Event, HTMLInputElement>;
	} = $props();

	const validatorText =
		min !== undefined && max !== undefined
			? `Must be between ${min.toLocaleString()} and ${max.toLocaleString()} ${type === 'text' ? 'characters long' : ''}`
			: 'Field cannot be empty';
</script>

<InputLabel validatorText={noValidation ? undefined : validatorText}>
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
		{min}
		{max}
		minlength={type === 'text' ? min : undefined}
		maxlength={type === 'text' ? max : undefined}
		{autocomplete}
		{autocorrect}
		{required}
		{oninput}
	/>
</InputLabel>
