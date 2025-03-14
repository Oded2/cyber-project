<script lang="ts">
	import type { FullAutoFill, HTMLInputTypeAttribute } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import { format } from '$lib';

	const {
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
		autocorrect
	}: {
		min?: number;
		max?: number;
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
	} = $props();
</script>

<InputLabel
	validatorText={min
		? `Must be at least ${min.toLocaleString()}`
		: minlength
			? `Must be at least ${minlength?.toLocaleString()} characters long`
			: 'Field cannot be empty'}
>
	{displayName}
	<input
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

<!-- <label class="flex w-full flex-col">
	<div class="label">
		<span class="text-lg font-semibold">{displayName}</span>
	</div>
	<input
		type="text"
		{value}
		onchange={handleChange}
		{placeholder}
		{autocorrect}
		class="input input-sm w-full py-5"
		{minlength}
		{maxlength}
		{required}
		{name}
	/>
	{#if !required}
		<div class="label"><span class="label-text-alt font-light italic">Optional</span></div>
	{/if}
	{#if errorMessage.length > 0}
		<span class="text-error px-3 text-sm">{errorMessage}</span>
	{/if}
</label> -->
