<script lang="ts">
	import { flip } from 'svelte/animate';
	import { toasts, dismissToast } from '../toasts';
	import Toast from './Toast.svelte';
	import { flipConfig } from '$lib';
</script>

<section class="fixed bottom-2 left-2 flex flex-col gap-4 print:hidden">
	{#each $toasts as toast (toast.id)}
		<div animate:flip={flipConfig}>
			<Toast type={toast.type} duration={toast.duration} handleClose={() => dismissToast(toast.id)}>
				{toast.text}
			</Toast>
		</div>
	{/each}
</section>
