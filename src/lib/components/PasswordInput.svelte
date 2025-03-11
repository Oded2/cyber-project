<script lang="ts">
	import type { HTMLInputTypeAttribute } from 'svelte/elements';
	import InputLabel from './InputLabel.svelte';
	import type { Snippet } from 'svelte';

	let {
		password = $bindable(),
		placeholder,
		children
	}: { password: string; placeholder: string; children?: Snippet } = $props();

	let type: HTMLInputTypeAttribute = $state('password');

	function changeType() {
		type = type === 'text' ? 'password' : 'text';
	}
</script>

<InputLabel>
	<input
		bind:value={password}
		{type}
		autocomplete="off"
		spellcheck="false"
		class="grow"
		{placeholder}
		data-1p-ignore
		data-lpignore="true"
		data-bwignore
		data-form-type="other"
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
</InputLabel>
