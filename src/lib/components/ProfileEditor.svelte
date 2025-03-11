<script lang="ts">
	let {
		title,
		value = $bindable(),
		values = {},
		action,
		min = 0,
		max = 50,
		inputType = 'text',
		required = false,
		allowPaste = false
	}: {
		title: string;
		value: string;
		values?: { [key: string]: string };
		action: () => Promise<void>;
		min?: number;
		max?: number;
		inputType?: 'text' | 'email' | 'password';
		required?: boolean;
		allowPaste?: boolean;
	} = $props();

	const keys = Object.keys(values);

	let edit = $state(false);
	let progress = $state(false);

	async function handlePaste(): Promise<void> {
		try {
			value = await navigator.clipboard.readText();
		} catch {
			console.error('Unable to paste');
		}
	}
</script>

<form
	class="mb-2 flex w-full max-w-md flex-col overflow-hidden border-b-2 pb-1"
	onsubmit={async (e) => {
		// preventDefault stops the form from trying to contact the server
		e.preventDefault();
		progress = true;
		await action();
		progress = false;
		edit = false;
	}}
>
	<div class="label">
		<span class="label-text">{title}</span>
		<div hidden={!edit} class="text-info" class:opacity-50={progress}>
			{#if allowPaste}
				<button onclick={handlePaste} type="button" class="me-2" aria-label="Paste"
					><i class="fa-solid fa-paste"></i></button
				>
			{/if}
			<button type="submit">Confirm</button>
		</div>
		<button hidden={edit} type="button" class="text-info" onclick={() => (edit = true)}>
			Edit
		</button>
	</div>
	{#if edit}
		{#if keys.length > 0}
			<select
				name={title}
				bind:value
				class="select select-sm border-none! outline-hidden!"
				{required}
			>
				{#each keys as key, index}
					<option value={key} selected={index == 0}>{values[key]}</option>
				{/each}
			</select>
		{:else}
			<input
				name={title}
				bind:value
				type={inputType}
				class="input input-xs border-0 text-base outline-hidden!"
				{required}
				minlength={min}
				maxlength={max}
			/>
		{/if}
	{:else}
		<div class="px-2">
			<h6 class="whitespace-nowrap font-light">
				{#if value.length > 0}
					{value}
				{:else}
					&nbsp;
				{/if}
			</h6>
		</div>
	{/if}
</form>
