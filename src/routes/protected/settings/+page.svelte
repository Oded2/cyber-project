<script lang="ts">
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';
	import { addParams, capitalizeFirstLetter, hrefs, isTaken, showModal, validUsername } from '$lib';
	import Alert from '$lib/components/Alert.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import Title from '$lib/components/Title.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	type CurrentPage = 'profile' | 'account' | 'logbook' | 'aircraft';

	const { data } = $props();
	const { supabase, user, profile, page: pageDirect } = data;
	let { aircrafts } = $state(data);
	const updatedProfile = $state(profile);
	// User cannot be null due to this being a protected page
	let email = $state(user!.email!);
	let currentPage: CurrentPage = $state(pageDirect);
	// When deleting, there needs to be a variable with the ID of the aircraft I would like to delete
	let currentID: number;
	onMount(() => {
		if (pageDirect === 'aircraft') fetchAircrafts();
	});

	const errors = $state({
		invalidUsername: false,
		usernameTaken: false
	});

	async function handleDelete(): Promise<void> {
		await supabase.from('aircrafts').delete().eq('id', currentID);
		aircrafts = aircrafts.filter((obj) => obj.id !== currentID);
	}

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
					{#if aircrafts.length > 0}
						<div class="grid grid-cols-3 gap-4">
							{#each aircrafts as aircraft (aircraft)}
								<div
									class="card relative col-auto w-full shadow transition hover:shadow-xl"
									animate:flip={{ duration: 500 }}
								>
									<div class="card-body">
										<div class="mb-2">
											<h2 class="card-title">{aircraft.nickname}</h2>
											<span class="text-light text-sm">{aircraft.tail_number}</span>
										</div>
										<div class="card-actions justify-end">
											<a
												aria-label="Edit"
												href={addParams(
													hrefs.registerAircraft,
													{ id: aircraft.id.toString() },
													$page.url.origin
												)}
												class="btn btn-outline btn-accent">Edit</a
											>
											<button
												aria-label="Delete"
												class="btn btn-outline btn-error"
												onclick={() => {
													currentID = aircraft.id;
													showModal('delete');
												}}>Delete</button
											>
										</div>
									</div>
									<div
										class="tooltip absolute right-2 top-2"
										data-tip={capitalizeFirstLetter(aircraft.visibility)}
									>
										{#if aircraft.visibility !== 'private'}
											<i class="fa-solid fa-eye"></i>
										{:else}
											<i class="fa-solid fa-eye-slash"></i>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="max-w-xs border-b-2 pb-2">
							<h1 class="text-lg">No registered aircrafts yet</h1>
						</div>
					{/if}<a href={hrefs.registerAircraft} class="btn btn-info mt-5">Add aircraft</a>
				{/if}
			</div>
		</div>
	</Container>
</main>

<ConfirmationModal id="delete" onconfirmation={handleDelete}></ConfirmationModal>

<Alert
	visible={errors.invalidUsername}
	message="Username can only contain latin letters and numbers."
></Alert>
<Alert visible={errors.usernameTaken} message="Username already taken"></Alert>

<Title title="Settings"></Title>
