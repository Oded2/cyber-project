<script lang="ts">
	let {
		title,
		value = $bindable(),
		action,
		min = 0,
		max = 50
	}: {
		title: string;
		value: string;
		action: () => Promise<void>;
		min?: number;
		max?: number;
	} = $props();
	let edit = $state(false);

	let progress = $state(false);
</script>

<div class="form-control mb-2 w-full max-w-xs border-b-2 pb-1">
	<div class="label">
		<span class="label-text">{title}</span>
		<button
			class="text-info"
			class:opacity-50={progress}
			onclick={async () => {
				if (edit) {
					progress = true;
					await action();
					progress = false;
					edit = false;
				} else {
					edit = true;
				}
			}}>{edit ? 'Confirm' : 'Edit'}</button
		>
	</div>
	{#if edit}
		<input
			bind:value
			type="text"
			class="input input-xs border-0 text-base !outline-none"
			minlength={min}
			maxlength={max}
		/>
	{:else}
		<div class="px-2"><h6 class="font-light">{value}</h6></div>
	{/if}
</div>
