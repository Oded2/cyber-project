<script lang="ts">
	import type { FormEvent } from '$lib';
	import type { HTMLInputTypeAttribute } from 'svelte/elements';

	let {
		title,
		value = $bindable(),
		values = {},
		action,
		min,
		max,
		inputType = 'text',
		required,
		validatorText
	}: {
		title: string;
		value: string;
		values?: { [key: string]: string };
		action: () => Promise<void>;
		min?: number;
		max?: number;
		inputType?: HTMLInputTypeAttribute;
		required?: boolean;
		validatorText?: string;
	} = $props();

	const keys = Object.keys(values);

	let edit = $state(false);
	let progress = $state(false);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		progress = true;
		await action();
		progress = false;
		edit = false;
	}
</script>

<form class="mb-2" onsubmit={handleSubmit}>
	<fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs p-4">
		<legend class="fieldset-legend">{title}</legend>
		<div class="join">
			{#if keys.length > 0}
				<select
					name={title}
					disabled={!edit}
					bind:value
					class="select select-sm join-item border-none! outline-hidden!"
					{required}
				>
					{#each keys as key, index}
						<option value={key} selected={index == 0}>{values[key]}</option>
					{/each}
				</select>
			{:else}
				<div class="flex w-full flex-col">
					<input
						name={title}
						bind:value
						type={inputType}
						class="input join-item validator"
						{required}
						minlength={min}
						maxlength={max}
						disabled={!edit}
					/>
					{#if validatorText}
						<p class="validator-hint">{validatorText}</p>
					{/if}
				</div>
			{/if}
			{#if edit}
				<button type="submit" class="btn btn-info join-item w-16">Save</button>
			{:else}
				<button
					type="button"
					onclick={() => {
						edit = true;
					}}
					class="btn btn-info join-item w-16"
				>
					Edit
				</button>
			{/if}
		</div>
	</fieldset>
</form>
