<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirstLetter, hrefs, isTaken } from '$lib';
	import Alert from '$lib/components/Alert.svelte';
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import Title from '$lib/components/Title.svelte';

	type CurrentPage = 'profile' | 'account' | 'logbook';
	type ProfileKeys = 'display' | 'username' | 'bio';

	const { data } = $props();
	const { supabase, user, profile } = data;
	const updatedProfile = $state(profile);
	let email = $state(user?.email) as string;

	let currentPage: CurrentPage = $state('account');
	let usernameTaken: boolean = $state(false);

	async function updateProfile(key: ProfileKeys) {
		if (updatedProfile[key] === profile[key]) return;
		const { error: e } = await supabase
			.from('profiles')
			.update({ [key]: updatedProfile[key] })
			.eq('id', user?.id);
		if (e) {
			console.error(e);
			return;
		}
		profile[key] = updatedProfile[key];
	}
</script>

<main>
	<Container>
		<div class="mt-10 flex flex-col gap-4 sm:flex-row">
			<div class="overflow-auto sm:w-60 sm:border-e-2 sm:pe-2">
				<div class="flex w-full gap-2 sm:flex-col">
					<SettingsButton
						onclick={() => (currentPage = 'profile')}
						active={currentPage === 'profile'}
						><i class="fa-solid fa-user"></i> Profile</SettingsButton
					>
					<SettingsButton
						onclick={() => (currentPage = 'account')}
						active={currentPage === 'account'}
						><i class="fa-solid fa-address-card"></i> Account</SettingsButton
					>
					<SettingsButton
						onclick={() => (currentPage = 'logbook')}
						active={currentPage === 'logbook'}
						><i class="fa-solid fa-book"></i> Logbook</SettingsButton
					>
				</div>
			</div>
			<div class="w-full">
				<div class="mb-3 border-b-2 pb-2">
					<h2 class="text-2xl font-bold">{capitalizeFirstLetter(currentPage)} Settings</h2>
				</div>
				{#if currentPage === 'profile'}
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
					<ProfileEditor
						title="Username"
						bind:value={updatedProfile.username}
						action={async () => {
							if (updatedProfile.username === profile.username) return;
							if (await isTaken(updatedProfile.username, supabase)) {
								usernameTaken = true;
								setTimeout(() => (usernameTaken = false), 5000);
								updatedProfile.username = profile.username;
								return;
							}
							await updateProfile('username');
						}}
						min={2}
						max={50}
					></ProfileEditor>
				{:else if currentPage === 'account'}
					<ProfileEditor
						title="Email"
						inputType="email"
						min={2}
						bind:value={email}
						action={async () => {
							if (email === user?.email) return;
							const { error: e } = await supabase.auth.updateUser({ email });
							if (e) {
								console.error(e);
								return;
							}
							alert(`A verification email has been sent to ${email}`);
							goto(hrefs.home);
						}}
					></ProfileEditor>
					<a href={hrefs.passwordReset} class="btn btn-neutral">Reset Password</a>
				{/if}
			</div>
		</div>
	</Container>
</main>

<Alert visible={usernameTaken} message="Username already taken"></Alert>

<Title title="Settings"></Title>
