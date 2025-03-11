<script lang="ts">
	import { format } from '$lib';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';

	const {
		min,
		max,
		maxLength,
		required,
		placeholder,
		name,
		id,
		value = '',
		type
	}: {
		min?: number;
		max?: number;
		maxLength?: number;
		required?: boolean;
		placeholder: string;
		name: string;
		id: string;
		value?: string;
		type?: HTMLInputTypeAttribute;
	} = $props();
</script>

<InputLabel validatorText="Invalid Input">
	{format(name)}
	<input
		{value}
		{type}
		{name}
		class="grow"
		{placeholder}
		{min}
		{max}
		maxlength={maxLength}
		{id}
		{required}
	/>
</InputLabel>
