<script lang="ts">
	import { goto } from '$app/navigation';
	import { capitalizeFirstLetter, hrefs, isTaken, validUsername } from '$lib';
	import Alert from '$lib/components/Alert.svelte';
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import Title from '$lib/components/Title.svelte';

	type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';
	type Aircraft = {
		id: number; // bigint
		created_at: string; // timestamp with time zone
		nickname: string; // text
		tail_number: string; // text
		model: string; // text
		manufacturer: string; // text
		year_of_manufacture: number; // integer
		aircraft_type: string; // text
		category: string; // text
		aircraft_engine: string; // text
		number_of_engines: number; // integer
		maximum_takeoff_weight: number; // integer
		wingspan: number; // integer
		range: number; // integer
		cruising_speed: number; // integer
		fuel_capacity: number; // integer
		fuel_type: string; // text
		owner_name: string; // text
		seating_capacity: number; // integer
		modifications: string; // text
		notes: string; // text
		visibility: 'public' | 'private' | 'unlisted'; // text with constraints
		owner: string; // uuid
	};

	const { data } = $props();
	const { supabase, user, profile, page } = data;
	const updatedProfile = $state(profile);
	const aircrafts: Aircraft[] = $state([]);
	// User cannot be null due to this being a protected page
	let email = $state(user!.email!);
	let currentPage: CurrentPage = $state(page);

	const errors = $state({
		invalidUsername: false,
		usernameTaken: false
	});

	async function fetchAircrafts() {
		let { data: temp } = await supabase.from('aircrafts').select().eq('owner', user?.id);
		temp = temp!;
		for (let i = 0; i < temp.length; i++) aircrafts[i] = temp[i];
	}

	function showAlert(key: keyof typeof errors) {
		errors[key] = true;
		setTimeout(() => (errors[key] = false), 5000);
	}

	async function updateProfile(key: keyof typeof profile) {
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
						onclick={() => {
							currentPage = 'aircraft';
							fetchAircrafts();
						}}
						active={currentPage === 'aircraft'}
						><i class="fa-solid fa-plane"></i> Aircrafts</SettingsButton
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
							if (!validUsername(updatedProfile.username)) {
								showAlert('invalidUsername');
								updatedProfile.username = profile.username;
								return;
							}
							if (await isTaken(updatedProfile.username, supabase)) {
								showAlert('usernameTaken');
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
				{:else if currentPage === 'aircraft'}
					<div class="grid bg-red-500"></div>
					{#if aircrafts.length > 0}
						{#each aircrafts as aircraft}
							<div class="card"></div>
						{/each}
						<a href={hrefs.registerAircraft} class="btn btn-info">Add aircraft</a>
					{:else}
						<div class="mb-2 max-w-xs border-b-2 pb-2">
							<h1 class="text-lg">No registered aircrafts yet</h1>
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</Container>
</main>

<Alert
	visible={errors.invalidUsername}
	message="Username can only contain latin letters and numbers."
></Alert>
<Alert visible={errors.usernameTaken} message="Username already taken"></Alert>

<Title title="Settings"></Title>
