<script lang="ts">
	import Container from '$lib/components/Container.svelte';

	let password = $state('');
	let confirmPassword = $state('');

	let passwordMatch = $derived(password === confirmPassword);
</script>

<main>
	<Container>
		<form method="POST" action="?/reset">
			<div class="card mx-auto mt-10 max-w-md shadow-xl">
				<div class="card-body">
					<div class="mb-3 flex w-full flex-col border-b-2 pb-2">
						<h2 class="card-title mx-auto">Reset Password</h2>
					</div>
					<div class="grid gap-4">
						<label class="input input-bordered flex items-center gap-2">
							<div class="tooltip" data-tip="Must be at least 8 characters long">
								<i class="fa-solid fa-key opacity-70"></i>
							</div>
							<input
								type="password"
								name="password"
								class="grow"
								placeholder="Password"
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
								name="confirmPassword"
								class="grow"
								placeholder="Confirm Password"
								required
								bind:value={confirmPassword}
							/>
						</label>
					</div>
					<div class="card-actions mt-5">
						<button
							type="submit"
							class="btn btn-primary mx-auto w-full max-w-xs"
							disabled={password.length == 0 || !passwordMatch}>Reset Password</button
						>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>
