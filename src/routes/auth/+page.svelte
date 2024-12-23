<script lang="ts">
	import { validUsername } from '$lib';
	import Container from '$lib/components/Container.svelte';
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
	let invalidUsername: boolean = $state(false);
	let passwordMatch = $derived(password === confirmPassword);
	let mismatchError = $state(false);
	let passwordLengthError = $state(false);
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

<main>
	<Container>
		<div class="my-10 w-full">
			{#if signup}
				<form method="POST" action="?/signup">
					<div class="card mx-auto max-w-md shadow-xl">
						<div class="card-body">
							<div class="mb-3 flex w-full flex-col border-b-2 pb-2">
								<h2 class="card-title mx-auto">Sign Up</h2>
							</div>
							<div class="grid gap-4">
								<label class="input input-bordered flex items-center gap-2">
									<div class="tooltip" data-tip="You will be asked to verify this email">
										<i class="fa-solid fa-envelope opacity-70"></i>
									</div>
									<input
										type="email"
										name="email"
										class="grow"
										placeholder="Email"
										maxlength="500"
										required
										bind:value={email}
									/>
								</label>
								<label class="input input-bordered flex items-center gap-2">
									<div class="tooltip" data-tip="Does not have to be unique">
										<i class="fa-solid fa-signature opacity-70"></i>
									</div>
									<input
										type="text"
										name="display"
										class="grow"
										placeholder="Name"
										dir="auto"
										maxlength="50"
										required
										bind:value={displayName}
									/>
								</label>
								<div>
									<label class="input input-bordered flex items-center gap-2">
										<div class="tooltip" data-tip="Must be unique and use the latin alphabet">
											<i class="fa-solid fa-id-card opacity-70"></i>
										</div>
										<input
											type="text"
											name="username"
											class="grow"
											placeholder="Username"
											maxlength="50"
											required
											oninput={() => {
												usernameTaken = false;
												invalidUsername = false;
											}}
											onchange={() => (invalidUsername = !validUsername(username))}
											bind:value={username}
										/>
									</label>
									{#if invalidUsername}
										<span class="text-error"
											>Username can only contain latin letters and numbers.</span
										>
									{/if}
									{#if usernameTaken}
										<span class="text-error">Username already taken.</span>
									{/if}
								</div>
								<div>
									<label class="input input-bordered flex items-center gap-2">
										<div class="tooltip" data-tip="Must be at least 8 characters long">
											<i class="fa-solid fa-key opacity-70"></i>
										</div>
										<input
											type="password"
											name="password"
											class="grow"
											placeholder="Password"
											minlength="8"
											maxlength="128"
											required
											oninput={() => {
												mismatchError = false;
												passwordLengthError = false;
											}}
											onblur={() => {
												mismatchError = !passwordMatch;
												passwordLengthError = password.length < 8;
											}}
											bind:value={password}
										/>
									</label>
									{#if passwordLengthError}
										<span class="text-error">Password must be at least 8 characters long.</span>
									{/if}
								</div>
								<div>
									<label
										class="input input-bordered flex items-center gap-2"
										class:input-success={password.length > 0 && passwordMatch}
									>
										<div class="tooltip" data-tip="Confirm your password">
											<i class="fa-solid fa-circle-check opacity-70"></i>
										</div>
										<input
											type="password"
											class="grow"
											placeholder="Confirm Password"
											minlength="8"
											maxlength="128"
											required
											oninput={() => (mismatchError = false)}
											onblur={() => (mismatchError = !passwordMatch)}
											bind:value={confirmPassword}
										/>
									</label>
									{#if mismatchError}
										<span class="text-error">Passwords do not match</span>
									{/if}
								</div>
							</div>
							<div class="card-actions mt-5">
								<button
									type="submit"
									disabled={!(passwordMatch || password.length < 8)}
									class="btn btn-primary mx-auto w-full max-w-xs"
									>Create Account
								</button>
							</div>
						</div>
					</div>
				</form>
			{:else if forgotPassword}
				<form method="POST" action="?/reset">
					<div class="card mx-auto max-w-md shadow-xl">
						<div class="card-body">
							<div class="mb-3 flex w-full flex-col border-b-2 pb-2">
								<h2 class="card-title mx-auto">Reset Password</h2>
							</div>

							<label class="input input-bordered flex items-center gap-2">
								<div class="tooltip" data-tip="Email">
									<i class="fa-solid fa-envelope opacity-70"></i>
								</div>
								<input
									type="email"
									name="email"
									class="grow"
									placeholder="Email"
									maxlength="500"
									required
									bind:value={email}
								/>
							</label>

							<div class="card-actions mt-5">
								<button type="submit" class="btn btn-primary mx-auto w-full max-w-xs"
									>Send Reset Link</button
								>
							</div>
						</div>
					</div>
				</form>
			{:else}
				<form method="POST" action="?/login">
					<div class="card mx-auto max-w-md shadow-xl">
						<div class="card-body">
							<div class="mb-3 flex w-full flex-col border-b-2 pb-2">
								<h2 class="card-title mx-auto">Log In</h2>
								{#if form?.invalidCredentials}
									<h2 class="card-title mx-auto text-error">Incorrect username or password</h2>
								{/if}
							</div>
							<div class="grid gap-4">
								<label class="input input-bordered flex items-center gap-2">
									<div class="tooltip" data-tip="Email">
										<i class="fa-solid fa-envelope opacity-70"></i>
									</div>
									<input
										type="email"
										name="email"
										class="grow"
										placeholder="Email"
										maxlength="500"
										required
										bind:value={email}
									/>
								</label>
								<div>
									<label class="input input-bordered mb-1 flex items-center gap-2">
										<div class="tooltip" data-tip="Password">
											<i class="fa-solid fa-key opacity-70"></i>
										</div>
										<input
											type="password"
											name="password"
											class="grow"
											placeholder="Password"
											required
											bind:value={password}
										/>
									</label>
									<button
										type="button"
										onclick={() => (forgotPassword = true)}
										class="link px-4 text-sm">Forgot Password?</button
									>
								</div>
							</div>
							<div class="card-actions mt-5">
								<button type="submit" class="btn btn-primary mx-auto w-full max-w-xs">Log In</button
								>
							</div>
						</div>
					</div>
				</form>
			{/if}
			<div class="mx-auto mt-7 w-full text-center">
				{#if signup}
					<span
						>Already have an account? <button class="btn-link" onclick={swap}>Log In</button></span
					>
				{:else}
					<span
						>Don't have an account? <button class="btn-link" onclick={swap}>Sign Up</button></span
					>
				{/if}
			</div>
		</div>
	</Container>
</main>

<Title title={signup ? 'Sign Up' : 'Login'}></Title>
