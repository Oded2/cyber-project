<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Container from '$lib/components/Container.svelte';

	const { data, form } = $props();

	const { user } = data;
	const success = form?.success ?? false;
</script>

<main>
	<Container>
		<div class="card mx-auto mt-10 max-w-md border-2">
			<div class="card-body">
				{#if success}
					<h2 class="card-title text-success">Message sent successfully</h2>
				{/if}
				<h2 class="card-title mb-3">Contact</h2>
				<form method="POST">
					<label class="input input-bordered mb-3 flex items-center gap-2">
						Email
						<input
							type="email"
							name="email"
							class="grow"
							placeholder="example@domain.com"
							value={user?.email}
							required
						/>
					</label>
					<textarea
						minlength="10"
						name="message"
						class="textarea textarea-bordered w-full resize-none"
						rows="5"
						placeholder="Enter Message"
						required
					></textarea>
					<div class="card-actions mt-3">
						<button type="submit" class="btn btn-primary w-full"
							><i class="fa-solid fa-paper-plane"></i>Send</button
						>
					</div>
				</form>
			</div>
		</div>
	</Container>
</main>
<Title title="Contact"></Title>
