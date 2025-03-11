<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	let {
		password = $bindable(),
		placeholder,
		min,
		max,
		required,
		name,
		oninput,
		onblur,
		children
	}: {
		password: string;
		placeholder?: string;
		min?: number;
		max?: number;
		required?: boolean;
		name?: string;
		oninput?: () => void;
		onblur?: () => void;
		children?: Snippet;
	} = $props();

	let type: HTMLInputTypeAttribute = $state('password');

	function changeType() {
		type = type === 'text' ? 'password' : 'text';
	}
</script>

<input
	bind:value={password}
	{type}
	autocomplete="off"
	spellcheck="false"
	class="grow"
	minlength={min}
	maxlength={max}
	{placeholder}
	{required}
	{name}
	{oninput}
	{onblur}
/>
<button
	aria-label="Show Password"
	type="button"
	class="cursor-pointer text-gray-500"
	onclick={changeType}
>
	{#if type === 'password'}
		<i class="fa-solid fa-eye"></i>
	{:else if type === 'text'}
		<i class="fa-solid fa-eye-slash"></i>
	{/if}
</button>
{#if children}
	<div class="cursor-auto">
		{@render children()}
	</div>
{/if}
