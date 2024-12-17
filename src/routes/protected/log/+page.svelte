<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import LogInput from '$lib/components/LogInput.svelte';

	const { data } = $props();
	const { profile, supabase, aircrafts } = data;
</script>

<main>
	<Container>
		<main>
			<Container>
				<form method="POST">
					<!-- Hidden submit button that actually submits the form -->
					<button class="hidden" aria-label="Submit" id="submit" type="submit"></button>
					<div class="card mx-auto mb-10 mt-5 max-w-5xl shadow-xl">
						<div class="card-body">
							<div class="mb-2">
								<h2 class="card-title">Log Flight</h2>
							</div>
							<div class="flex flex-col gap-4">
								<LogInput name="pilot_in_command" value={profile.display} required maxlength={50}
								></LogInput>
							</div>
						</div>
					</div>
				</form>
			</Container>
		</main>
	</Container>
</main>
