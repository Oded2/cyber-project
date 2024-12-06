<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

	const { data } = $props();

	const { supabase, errorMessage, signup: initial } = data;
	let { signup } = $state(data);

	let email: string = $state('');
	let displayName: string = $state('');
	let username: string = $state('');
	let password: string = $state('');
	let confirmPassword: string = $state('');
	let invalidUsername: boolean = $state(false);
	let passwordMatch = $derived(password === confirmPassword);

	function swap() {
		email = '';
		displayName = '';
		username = '';
		password = '';
		confirmPassword = '';
		signup = !signup;
		document.title = signup ? 'Sign Up' : 'Login';
	}
	async function usernameExist(username: string): Promise<boolean> {
		const { data, error: e } = await supabase.from('profiles').select().eq('username', username);
		if (e) console.error(e);
		if (data) return data.length > 0;
		return false;
	}
	async function handleSignUp(): Promise<void> {
		if (await usernameExist(username)) {
			invalidUsername = true;
			return;
		}
		document.getElementById('submit')?.click();
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
								{#if invalidUsername}
									<h2 class="card-title mx-auto text-error">Username already taken</h2>
								{/if}
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
										oninput={() => (invalidUsername = false)}
										bind:value={username}
									/>
								</label>
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
										bind:value={password}
									/>
								</label>
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
										bind:value={confirmPassword}
									/>
								</label>
							</div>
							<div class="card-actions mt-5">
								<button
									type="button"
									onclick={handleSignUp}
									class="btn btn-primary mx-auto w-full max-w-xs"
									>Create Account
								</button>
								<button type="submit" id="submit" aria-label="Hidden Submit" class="hidden"
								></button>
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
								{#if errorMessage.length > 0}
									<h2 class="card-title mx-auto text-error">{errorMessage}</h2>
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

								<label class="input input-bordered flex items-center gap-2">
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

<Title title={initial ? 'Sign Up' : 'Login'}></Title>
