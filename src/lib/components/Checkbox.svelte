<script lang="ts">
	let {
		id,
		name,
		checked = $bindable(false),
		text
	}: { id?: string; name?: string; checked?: boolean; text?: string } = $props();
</script>

<div class="form-control">
	<label class="flex max-w-xs cursor-pointer gap-2">
		{#if text}
			<span class="text-lg font-semibold">{text}</span>
		{/if}
		<input type="checkbox" {id} {name} {checked} class="checkbox-info checkbox" />
	</label>
</div>
