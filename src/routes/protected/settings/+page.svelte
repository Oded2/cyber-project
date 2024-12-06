<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import Title from '$lib/components/Title.svelte';

	type CurrentPage = 'profile' | 'logbook';
	type ProfileKeys = 'display' | 'username' | 'bio';

	const { data } = $props();
	const { supabase, user, profile } = data;
	const updatedProfile = $state(profile);

	let currentPage: CurrentPage = $state('profile');

	async function updateProfile(key: ProfileKeys) {
		if (updatedProfile[key] === profile[key]) return;
		const { error: e } = await supabase
			.from('profiles')
			.update({ [key]: updatedProfile[key] })
			.eq('id', user?.id);
		if (e) console.error(e);
		profile[key] = updatedProfile[key];
	}
</script>

<main>
	<Container>
		<div class="mt-10 grid grid-cols-5 gap-4">
			<div class="col-span-1 border-e-2 pe-2">
				<div class="flex w-full flex-col gap-2">
					<SettingsButton
						onclick={() => (currentPage = 'profile')}
						active={currentPage === 'profile'}
						><i class="fa-solid fa-user"></i> Profile</SettingsButton
					>
					<SettingsButton
						onclick={() => (currentPage = 'logbook')}
						active={currentPage === 'logbook'}
						><i class="fa-solid fa-book"></i> Logbook</SettingsButton
					>
				</div>
			</div>
			<div class="col-span-4">
				{#if currentPage === 'profile'}
					<div class="mb-3 border-b-2 pb-2">
						<h2 class="text-2xl font-bold">Profile Settings</h2>
					</div>
					<ProfileEditor
						title="Display Name"
						min={2}
						bind:value={updatedProfile.display}
						action={() => updateProfile('display')}
					></ProfileEditor>
					<ProfileEditor
						title="Bio"
						bind:value={updatedProfile.bio}
						action={() => updateProfile('bio')}
						max={200}
					></ProfileEditor>
				{/if}
			</div>
		</div>
	</Container>
</main>

<Title title="Settings"></Title>
