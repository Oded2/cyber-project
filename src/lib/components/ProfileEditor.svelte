<script lang="ts">
	import { enhance } from '$app/forms';

	let {
		title,
		value = $bindable(),
		action,
		min = 0,
		max = 50,
		inputType = 'text'
	}: {
		title: string;
		value: string;
		action: () => Promise<void>;
		min?: number;
		max?: number;
		inputType?: 'text' | 'email' | 'password';
	} = $props();
	let edit = $state(false);

	let progress = $state(false);
</script>

<form
	class="mb-2 flex w-full max-w-md flex-col border-b-2 pb-1"
	onsubmit={async () => {
		progress = true;
		await action();
		progress = false;
		edit = false;
	}}
>
	<div class="label">
		<span class="label-text">{title}</span>
		<button hidden={!edit} type="submit" class="text-info" class:opacity-50={progress}>
			Confirm
		</button>
		<button hidden={edit} type="button" class="text-info" onclick={() => (edit = true)}>
			Edit
		</button>
	</div>
	{#if edit}
		<input
			name={title}
			bind:value
			type={inputType}
			class="input input-xs border-0 text-base !outline-none"
			required
			minlength={min}
			maxlength={max}
		/>
	{:else}
		<div class="px-2">
			<h6 class="font-light">
				{#if value.length > 0}
					{value}
				{:else}
					&nbsp;
				{/if}
			</h6>
		</div>
	{/if}
</form>
