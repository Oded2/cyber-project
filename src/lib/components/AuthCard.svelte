<script lang="ts">
	import type { Snippet } from 'svelte';

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
		disabled,
		children
	}: { authType: keyof typeof texts; disabled?: boolean; children: Snippet } = $props();
</script>

<div class="card mx-auto max-w-md shadow-xl">
	<div class="card-body">
		<div class="mb-3 flex w-full flex-col border-b-2 pb-2">
			<h2 class="card-title mx-auto">{texts[authType].title}</h2>
		</div>
		<div class="flex flex-col gap-2">
			{@render children()}
		</div>
		<div class="card-actions mt-5">
			<button type="submit" {disabled} class="btn btn-primary mx-auto w-full max-w-xs">
				{texts[authType].submit}
			</button>
		</div>
	</div>
</div>
