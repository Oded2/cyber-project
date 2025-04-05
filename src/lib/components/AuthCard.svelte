<script lang="ts">
	import type { Snippet } from 'svelte';
	import CardActions from './CardActions.svelte';

	const texts = {
		signup: {
			title: 'Sign Up',
			submit: 'Create Account'
		},
		login: {
			title: 'Log In',
			submit: 'Log In'
		},
		reset: {
			title: 'Reset Password',
			submit: 'Send Reset Link'
		}
	};

	const {
		authType,
		errorMessage,
		children
	}: { authType: keyof typeof texts; errorMessage?: string; children: Snippet } = $props();
</script>

<div class="card mx-auto max-w-md shadow-xl">
	<div class="card-body">
		<div class="mb-3 flex w-full flex-col items-center border-b-2 pb-2">
			<h2 class="card-title">{texts[authType].title}</h2>
			{#if errorMessage}
				<h2 class="text-error text-base font-bold">{errorMessage}</h2>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			{@render children()}
		</div>
		<CardActions>
			<button type="submit" class="btn btn-primary mx-auto w-full max-w-xs">
				{texts[authType].submit}
			</button>
		</CardActions>
	</div>
</div>
