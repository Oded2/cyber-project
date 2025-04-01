<script lang="ts">
	import type { FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import { format } from '$lib';

	const {
		id,
		min,
		max,
		minlength,
		maxlength,
		required,
		placeholder,
		name,
		displayName = format(name),
		value,
		type,
		autocomplete,
		autocorrect,
		noValidation
	}: {
		id?: string;
		min?: number | string;
		max?: number | string;
		minlength?: number;
		maxlength?: number;
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
	} = $props();
</script>

<InputLabel
	validatorText={noValidation
		? undefined
		: min
			? `Must be at between ${min.toLocaleString()} and ${max ? max.toLocaleString() : 'unknown'}`
			: minlength
				? `Must be at least ${minlength?.toLocaleString()} characters long`
				: 'Field cannot be empty'}
>
	{displayName}
	{#if !required}
		<span class="font-light italic">(optional)</span>
	{/if}
	<input
		{id}
		{value}
		{type}
		{name}
		class="grow"
		{placeholder}
		{min}
		{max}
		{minlength}
		{maxlength}
		{autocomplete}
		{autocorrect}
		{required}
	/>
</InputLabel>
