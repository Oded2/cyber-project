<script lang="ts">
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';
	import {
		addParams,
		capitalizeFirstLetter,
		defaultProfilePicture,
		format,
		getWeatherData,
		handleLogs,
		hrefs,
		isTaken,
		showModal,
		validUsername
	} from '$lib';
	import Alert from '$lib/components/Alert.svelte';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import Title from '$lib/components/Title.svelte';
	import { page } from '$app/stores';
	import Collapse from '$lib/components/Collapse.svelte';

	const { data } = $props();
	const { supabase, user, profile, page: pageDirect } = data;
	const updatedProfile = $state(profile);
	const visibilities = {
		private: 'Privatize',
		unlisted: 'Unlist',
		public: 'Publicize'
	};
	let { aircrafts } = $state(data);
	// User cannot be null due to this being a protected page
	let email = $state(user!.email!);
	let currentPage = $state(pageDirect);
	// When deleting, there needs to be a variable with the ID of the aircraft I would like to delete
	let currentID: number;
	let currentFilter: 'all' | 'unfavorite' | 'favorite' | 'private' | 'public' | 'unlisted' =
		$state('all');
	let currentVisibility: keyof typeof visibilities = $state('private');
	let logUpdate = $state({
		inProgress: false,
		isFinished: false
	});

	const errors = $state({
		invalidUsername: false,
		usernameTaken: false
	});

	async function handleAircraftDelete(): Promise<void> {
		await supabase.from('aircrafts').delete().eq('id', currentID);
		aircrafts = aircrafts.filter((obj) => obj.id != currentID);
	}

	function showAlert(key: keyof typeof errors) {
		errors[key] = true;
		setTimeout(() => (errors[key] = false), 5000);
	}

	async function updateProfile(key: keyof typeof profile) {
		// Checks if the profile has actually been updated, else it will call a fetch
		// for no reason
		if (updatedProfile[key] === profile[key]) return;
		const { error: e } = await supabase
			.from('profiles')
			.update({ [key]: updatedProfile[key] })
			.eq('id', user?.id);
		if (e) {
			console.error(e);
			return;
		}
		// To ensure that the user sees the updated field
		profile[key] = updatedProfile[key];
	}

	function handleAccountDelete(): void {
		const hiddenButton: HTMLButtonElement = document.getElementById(
			'deleteAccountButton'
		) as HTMLButtonElement;
		hiddenButton.click();
	}
	async function changeLogsVisibility(visibility: keyof typeof visibilities): Promise<void> {
		await supabase.from('logs').update({ visibility }).eq('owner', user!.id);
	}
	async function handleLogPurge(filter: typeof currentFilter): Promise<void> {
		const userId = user!.id;
		const shortcut = supabase.from('logs').delete;
		if (filter === 'all') await shortcut().eq('owner', userId);
		else if (filter === 'favorite') await shortcut().eq('owner', userId).eq('favorite', true);
		else if (filter === 'unfavorite') await shortcut().eq('owner', userId).eq('favorite', false);
		else await shortcut().eq('owner', userId).eq('visibility', filter);
	}
	async function updateLogs(): Promise<void> {
		// This function updates the weather in any logs that were logged before they happened
		const today = new Date();
		logUpdate.inProgress = true;
		const { data: temp } = await supabase.from('logs').select().eq('owner', user!.id);
		const logs = temp as Log[];
		handleLogs(logs);
		for (const log of logs) {
			// Checks to see if the log has true weather and that it was before the current date
			if (!log.true_weather && log.des_time < today) {
				const newDepWeather = await getWeatherData(
					log.dep_time,
					log.dep_airport.longitude,
					log.dep_airport.latitude
				);
				const newDesWeather = await getWeatherData(
					log.des_time,
					log.des_airport.longitude,
					log.des_airport.latitude
				);
				const toUpdate = {
					dep_weather: newDepWeather,
					des_weather: newDesWeather,
					true_weather: true
				};
				await supabase.from('logs').update(toUpdate).eq('owner', user!.id).eq('id', log.id);
			}
		}
		logUpdate.inProgress = false;
		logUpdate.isFinished = true;
	}
</script>

<Container>
	<div class="flex flex-col gap-4 sm:flex-row">
		<div class="overflow-auto sm:w-60 sm:border-e-2 sm:pe-2">
			<div class="flex w-full gap-2 sm:flex-col">
				{@render settingsButton(
					'Profile',
					'fa-solid fa-user',
					() => (currentPage = 'profile'),
					currentPage === 'profile'
				)}

				{@render settingsButton(
					'Account',
					'fa-solid fa-address-card',
					() => (currentPage = 'account'),
					currentPage === 'account'
				)}
				{@render settingsButton(
					'Aircrafts',
					'fa-solid fa-plane',
					() => (currentPage = 'aircraft'),
					currentPage === 'aircraft'
				)}
				{@render settingsButton(
					'Logs',
					'fa-solid fa-book',
					() => (currentPage = 'logs'),
					currentPage === 'logs'
				)}
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
					required
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
					required
				></ProfileEditor>
				<ProfileEditor
					title="Profile Picture URL"
					bind:value={updatedProfile.image}
					max={9999}
					allowPaste
					action={async () => {
						await updateProfile('image');
						const pfp = document.getElementById('profilePicture') as HTMLImageElement;
						pfp.src = profile.image.length > 0 ? profile.image : defaultProfilePicture;
					}}
				></ProfileEditor>
			{:else if currentPage === 'account'}
				<ProfileEditor
					title="Email"
					inputType="email"
					min={2}
					bind:value={email}
					required
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
				<div class="max-w-[10rem]">
					<button onclick={() => showModal('passwordReset')} class="btn btn-neutral w-full"
						>Reset Password</button
					>
					<button
						class="btn btn-outline btn-error mt-2 w-full"
						onclick={() => showModal('deleteAccount')}>Delete Account</button
					>
				</div>
			{:else if currentPage === 'aircraft'}
				{#if aircrafts.length > 0}
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
												showModal('deleteAircraft');
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
			{:else if currentPage === 'logs'}
				<div class="flex flex-col gap-2">
					<button
						class="btn btn-outline btn-primary max-w-xs"
						onclick={updateLogs}
						disabled={logUpdate.inProgress || logUpdate.isFinished}
					>
						{#if logUpdate.inProgress}
							<span class="loading loading-spinner"></span>
						{:else if logUpdate.isFinished}
							Logs are up to date
						{:else}
							Update Logs
						{/if}
					</button>
					{@render visibilityButton('public')}
					{@render visibilityButton('unlisted')}
					{@render visibilityButton('private')}
					{@render purgeLogsButton('all')}
					<Collapse title="More Options">
						<div class="flex flex-col gap-2">
							{@render purgeLogsButton('unfavorite')}
							{@render purgeLogsButton('favorite')}
							{@render purgeLogsButton('private')}
							{@render purgeLogsButton('unlisted')}
							{@render purgeLogsButton('public')}
						</div>
					</Collapse>
				</div>
			{/if}
		</div>
	</div>
</Container>

<!-- Hidden form that sends a request to the server to delete the user's account -->
<form action="?/deleteAccount" method="POST" class="hidden">
	<button aria-label="Delete Account" type="submit" id="deleteAccountButton"></button>
</form>

<ConfirmationModal id="passwordReset" href={hrefs.passwordReset}></ConfirmationModal>
<ConfirmationModal
	message="This action cannot be undone."
	id="deleteAccount"
	text={`${profile.username}/account`}
	onconfirmation={handleAccountDelete}
></ConfirmationModal>
<ConfirmationModal
	id="deleteAircraft"
	message="This will delete all of the logs related to this aircraft."
	onconfirmation={handleAircraftDelete}
></ConfirmationModal>
<ConfirmationModal
	message={`All of your logs will become ${currentVisibility}.`}
	id="visibilityModal"
	onconfirmation={() => changeLogsVisibility(currentVisibility)}
></ConfirmationModal>
<ConfirmationModal
	message={`This action will delete ALL of your${currentFilter === 'all' ? ' ' : ` ${currentFilter} `}logs and cannot be undone.`}
	id="purgeLogs"
	onconfirmation={() => handleLogPurge(currentFilter)}
	text={`${profile.username}/logs/${currentFilter}`}
></ConfirmationModal>

<Alert
	visible={errors.invalidUsername}
	message="Username can only contain latin letters and numbers."
></Alert>
<Alert visible={errors.usernameTaken} message="Username already taken"></Alert>

<Title title="Settings"></Title>

{#snippet settingsButton(text: string, icon: string, onclick: () => void, active: boolean)}
	<button class="btn btn-outline btn-info justify-start" class:btn-active={active} {onclick}>
		<i class={icon}></i>{text}
	</button>
{/snippet}

{#snippet visibilityButton(visibility: typeof currentVisibility)}
	<button
		onclick={() => {
			currentVisibility = visibility;
			showModal('visibilityModal');
		}}
		class="btn btn-outline btn-info max-w-xs">{`${visibilities[visibility]} Logs`}</button
	>
{/snippet}

{#snippet purgeLogsButton(filter: typeof currentFilter)}
	<button
		onclick={() => {
			currentFilter = filter;
			showModal('purgeLogs');
		}}
		class="btn btn-outline btn-error max-w-xs">{`Delete ${format(filter)} Logs`}</button
	>
{/snippet}
