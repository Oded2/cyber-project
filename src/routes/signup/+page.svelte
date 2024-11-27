<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
</script>

<main>
	<Container>
		<div class="w-full">
			<div class="card mx-auto max-w-md shadow-xl">
				<div class="card-body">
					<div class="mb-3 flex w-full border-b-2 pb-2">
						<h2 class="card-title mx-auto">Sign Up</h2>
					</div>
					<label class="input input-bordered flex items-center gap-2">
						<i class="fa-solid fa-envelope opacity-70"></i>
						<input type="email" class="grow" placeholder="Email" />
					</label>
					<label class="input input-bordered flex items-center gap-2">
						<i class="fa-solid fa-signature opacity-70"></i>
						<input type="text" class="grow" placeholder="Name" />
					</label>
				</div>
			</div>
		</div>
	</Container>
</main>

<Title title={'Sign Up'}></Title>
