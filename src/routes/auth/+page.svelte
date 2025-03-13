<script lang="ts">
	import { usernameRegex } from '$lib';
	import AuthCard from '$lib/components/AuthCard.svelte';
	import Container from '$lib/components/Container.svelte';
	import InputLabel from '$lib/components/InputLabel.svelte';
	import PasswordInput from '$lib/components/PasswordInput.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data, form } = $props();

	const { signup: initial } = data;

	let signup: boolean = $state(form?.signup ?? initial);
	let email: string = $state(form?.email ?? '');
	let displayName: string = $state(form?.displayName ?? '');
	let username: string = $state(form?.username ?? '');
	let password: string = $state(form?.password ?? '');
	let confirmPassword: string = $state(form?.password ?? '');
	let usernameTaken: boolean = $state(form?.invalidUsername ?? false);
	let passwordMatch = $derived(password === confirmPassword);
	let mismatchError = $state(false);
	let forgotPassword = $state(false);

	function swap() {
		email = '';
		displayName = '';
		username = '';
		password = '';
		confirmPassword = '';
		forgotPassword = false;
		signup = !signup;
	}
</script>

<Container>
	<div class="my-10 w-full">
		{#if signup}
			<form method="POST" action="?/signup">
				<AuthCard
					authType="signup"
					errorMessage={usernameTaken ? 'Username already in use' : undefined}
				>
					<InputLabel validatorText="Enter a valid email address">
						{@render Icon('envelope', 'You will be asked to verify this email')}
						<input
							type="email"
							name="email"
							class="grow"
							required
							bind:value={email}
							placeholder="Email"
						/>
					</InputLabel>
					<InputLabel validatorText="This field cannot be empty">
						{@render Icon('signature', 'Your public display name')}
						<input
							type="text"
							name="display"
							class="grow"
							placeholder="Display Name"
							dir="auto"
							maxlength="50"
							required
							bind:value={displayName}
						/>
					</InputLabel>
					<div>
						<InputLabel validatorText="Must only contain latin letters and/or numbers">
							{@render Icon('id-card', 'Your unique username')}
							<input
								type="text"
								name="username"
								class="grow"
								placeholder="Username"
								maxlength="50"
								required
								pattern={usernameRegex.source}
								oninput={() => {
									usernameTaken = false;
								}}
								bind:value={username}
							/>
						</InputLabel>
					</div>
					<InputLabel validatorText="Password must be at least 8 characters long">
						{@render Icon('key', 'Secure access key')}
						<PasswordInput
							name="password"
							placeholder="Password"
							min={8}
							max={128}
							required
							oninput={() => {
								mismatchError = false;
							}}
							onblur={() => {
								mismatchError = !passwordMatch;
							}}
							bind:password
						></PasswordInput>
					</InputLabel>
					<div>
						<InputLabel>
							{@render Icon('circle-check', 'Confirm your password')}
							<PasswordInput
								placeholder="Confirm Password"
								min={8}
								max={128}
								required
								oninput={() => (mismatchError = false)}
								onblur={() => (mismatchError = !passwordMatch)}
								bind:password={confirmPassword}
							></PasswordInput>
						</InputLabel>
						<span
							class="text-error validator-hint"
							class:invisible={!mismatchError}
							class:visible={mismatchError}
							>Passwords do not match
						</span>
					</div>
				</AuthCard>
			</form>
		{:else if forgotPassword}
			<form method="POST" action="?/reset">
				<AuthCard authType="reset">
					<InputLabel validatorText="Enter a valid email address">
						{@render Icon('envelope', 'Email')}
						<input
							type="email"
							name="email"
							class="grow"
							placeholder="Email"
							required
							bind:value={email}
						/>
					</InputLabel>
				</AuthCard>
			</form>
		{:else}
			<form method="POST" action="?/login">
				<AuthCard
					authType="login"
					errorMessage={form?.invalidCredentials ? 'Invalid Credentials' : undefined}
				>
					<InputLabel validatorText="Field cannot be empty">
						{@render Icon('circle-user', 'Email or username')}
						<input
							type="text"
							name="identifier"
							class="grow"
							placeholder="Email or Username"
							required
							bind:value={email}
						/>
					</InputLabel>
					<InputLabel validatorText="Field cannot be empty">
						{@render Icon('key', 'Password')}
						<PasswordInput name="password" placeholder="Password" required bind:password
						></PasswordInput>
					</InputLabel>
					<button
						class="link me-auto"
						type="button"
						onclick={() => (forgotPassword = true)}
						value={password}
					>
						Forgot Password?
					</button>
				</AuthCard>
			</form>
		{/if}
		<div class="mx-auto mt-7 w-full text-center">
			{#if signup}
				<span>Already have an account? <button class="link" onclick={swap}>Log In</button></span>
			{:else}
				<span>Don't have an account? <button class="link" onclick={swap}>Sign Up</button></span>
			{/if}
		</div>
	</div>
</Container>

<Title title={signup ? 'Sign Up' : 'Login'}></Title>

{#snippet Icon(icon: string, tooltip: string)}
	<div class="tooltip" data-tip={tooltip}>
		<i class="fa-solid fa-{icon} cursor-auto opacity-70"></i>
	</div>
{/snippet}
