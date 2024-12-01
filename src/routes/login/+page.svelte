<script lang="ts">
	import { hrefs } from '$lib';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';

	let email: string = '';
	let password: string = '';
</script>

<main>
	<Container>
		<div class="my-10 w-full">
			<form method="POST" action="?/login">
				<div class="card mx-auto max-w-md shadow-xl">
					<div class="card-body">
						<div class="mb-3 flex w-full border-b-2 pb-2">
							<h2 class="card-title mx-auto">Log In</h2>
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
									minlength="8"
									required
									bind:value={password}
								/>
							</label>
						</div>
						<div class="card-actions mt-5">
							<button type="submit" class="btn btn-primary mx-auto w-full max-w-xs">Log In</button>
						</div>
					</div>
				</div>
			</form>
			<div class="mx-auto mt-7 w-full text-center">
				<span
					>Don't have an account? <a href={hrefs.signup} class="link link-primary">Sign Up</a></span
				>
			</div>
		</div>
	</Container>
</main>

<Title title={'Log In'}></Title>
