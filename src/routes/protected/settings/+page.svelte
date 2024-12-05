<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';

	const { data } = $props();
	const { profile } = data;
</script>

<main>
	<Container>
		<div class="mt-10 grid grid-cols-5 gap-4">
			<div class="col-span-1 border-e-2 pe-2">
				<div class="flex w-full flex-col gap-2">
					<SettingsButton><i class="fa-solid fa-home"></i> Home</SettingsButton>
					<SettingsButton><i class="fa-solid fa-user"></i> Profile</SettingsButton>
					<SettingsButton><i class="fa-solid fa-book"></i> Logbook</SettingsButton>
				</div>
			</div>
			<div class="col-span-4">
				<div class="flex w-full flex-col gap-2">
					Hello, {profile.display}
				</div>
			</div>
		</div>
	</Container>
</main>
