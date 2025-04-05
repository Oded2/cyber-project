<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardActions from './CardActions.svelte';

	const {
		title,
		includeSubmitButton,
		children
	}: { title?: string; includeSubmitButton?: boolean; children: Snippet } = $props();
</script>

<div class="card mx-auto mt-5 mb-10 max-w-3xl shadow-xl">
	<div class="card-body">
		{#if title}
			<div class="mb-2">
				<h2 class="card-title">{title}</h2>
			</div>
		{/if}
		<div class="flex flex-col gap-4">
			{@render children()}
		</div>
		{#if includeSubmitButton}
			<CardActions>
				<button type="submit" class="btn btn-primary">Submit</button>
			</CardActions>
		{/if}
	</div>
</div>
