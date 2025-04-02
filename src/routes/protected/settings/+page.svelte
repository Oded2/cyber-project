<script lang="ts">
	import { flip } from 'svelte/animate';
	import { goto } from '$app/navigation';
	import {
		addParams,
		bannedCountries,
		capitalizeFirstLetter,
		closeModal,
		countries,
		defaultProfilePicture,
		flipConfig,
		format,
		handleLogs,
		hrefs,
		isTaken,
		minDate,
		showModal,
		usernameRegex
	} from '$lib';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import Container from '$lib/components/Container.svelte';
	import ProfileEditor from '$lib/components/ProfileEditor.svelte';
	import Title from '$lib/components/Title.svelte';
	import { page } from '$app/state';
	import Collapse from '$lib/components/Collapse.svelte';
	import { addToast } from '$lib/toasts.js';
	import { getWeather } from '$lib/weather.js';
	import { buildRoute } from '$lib/coordinates.js';
	import type { EventHandler, MouseEventHandler } from 'svelte/elements';
	import LogInput from '$lib/components/LogInput.svelte';
	import Modal from '$lib/components/Modal.svelte';

	const { data } = $props();
	const { supabase, user, profile, page: pageDirect } = data;
	const updatedProfile = $state(profile);
	const pageUrl = page.url;
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
	let accountDeleteButton: HTMLButtonElement;
	let banCountryProgress: boolean = $state(false);

	async function handleAircraftDelete(): Promise<void> {
		await supabase.from('aircrafts').delete().eq('id', currentID);
		aircrafts = aircrafts.filter((obj) => obj.id != currentID);
	}

	async function updateProfile(key: keyof Profile) {
		// Checks if the profile has actually been updated, else it will call a fetch
		// for no reason
		if (updatedProfile[key] === profile[key]) return;
		const { error: e } = await supabase
			.from('profiles')
			.update({ [key]: updatedProfile[key] })
			.eq('id', user!.id);
		if (e) {
			console.error(e);
			return;
		}
		profile[key] = updatedProfile[key];
	}

	function handleAccountDelete(): void {
		accountDeleteButton.click();
	}

	async function changeLogsVisibility(visibility: keyof typeof visibilities): Promise<void> {
		await supabase.from('logs').update({ visibility }).eq('owner', user!.id);
	}

	async function handleLogPurge(filter: typeof currentFilter): Promise<void> {
		const userId = user!.id;
		if (filter === 'all') await supabase.from('logs').delete().eq('owner', userId);
		else if (filter === 'favorite')
			await supabase.from('logs').delete().eq('owner', userId).eq('favorite', true);
		else if (filter === 'unfavorite')
			await supabase.from('logs').delete().eq('owner', userId).eq('favorite', false);
		else await supabase.from('logs').delete().eq('owner', userId).eq('visibility', filter);
	}

	const updateLogs: EventHandler<MouseEvent, HTMLButtonElement> = async (e) => {
		// This function updates the weather in any logs that were logged before they happened
		const today = new Date();
		const button = e.currentTarget;
		button.disabled = true;
		const spinner = document.createElement('span');
		spinner.classList.add('loading', 'loading-spinner');
		button.appendChild(spinner);
		const { data: temp } = await supabase.from('logs').select().eq('owner', user!.id);
		const logs = temp as Log[];
		handleLogs(logs);
		for (const log of logs) {
			// Checks to see if the log has true weather and that it was before the current date
			if (!log.true_weather && log.des_time < today && log.dep_time > minDate) {
				const route = await buildRoute(
					[log.dep_airport.longitude, log.dep_airport.latitude],
					[log.des_airport.longitude, log.des_airport.latitude],
					profile.bannedCountries
				);
				const newWeather = await getWeather(route, log.dep_time, log.des_time);
				if (!newWeather) {
					addToast({
						type: 'error',
						text: 'Error fetching weather data, try again later',
						duration: 5000
					});
					continue;
				}
				const toUpdate = {
					weather_data: newWeather,
					true_weather: true
				};
				await supabase.from('logs').update(toUpdate).eq('owner', user!.id).eq('id', log.id);
			}
		}
		button.removeChild(spinner);
		button.textContent = 'Logs are up to date';
	};

	const unbanCountry: MouseEventHandler<HTMLButtonElement> = async (event) => {
		const country = event.currentTarget.getAttribute('data-country');
		event.currentTarget.disabled = true;
		const newBannedCountries = updatedProfile.bannedCountries.filter((val) => val !== country);
		const { error: e } = await supabase
			.from('profiles')
			.update({ bannedCountries: newBannedCountries })
			.eq('id', user!.id);
		if (e) {
			event.currentTarget.disabled = false;
			console.error(e);
			return;
		}
		updatedProfile.bannedCountries = newBannedCountries;
	};

	const banCountry: EventHandler<SubmitEvent, HTMLFormElement> = async (event) => {
		event.preventDefault();

		const form = event.currentTarget;
		const formData = new FormData(form);
		const countryToBan = formData.get('country')!.toString().toUpperCase();
		if (countryToBan.length < 2) {
			addToast({ type: 'error', text: 'Input must be a 2 letter country code', duration: 5000 });
			return;
		}
		const countryExists = Object.keys(countries).includes(countryToBan);
		if (!countryExists) {
			addToast({ type: 'error', text: "Country doesn't exist", duration: 5000 });
			return;
		}
		banCountryProgress = true;
		const updatedValue = [countryToBan, ...updatedProfile.bannedCountries];
		const { error: e } = await supabase
			.from('profiles')
			.update({ bannedCountries: updatedValue })
			.eq('id', user!.id);
		banCountryProgress = false;
		if (e) {
			console.error(e);
			return;
		}
		const input = document.getElementById('countryBanInput') as HTMLInputElement;
		input.value = '';
		updatedProfile.bannedCountries = updatedValue;
	};

	const handlePreset: MouseEventHandler<HTMLButtonElement> = async (event) => {
		const button = event.currentTarget;
		const preset = button.getAttribute('data-preset')!.split(',');
		button.disabled = true;
		const { error: e } = await supabase
			.from('profiles')
			.update({ bannedCountries: preset })
			.eq('id', user!.id);
		button.disabled = false;
		if (e) {
			console.error(e);
			return;
		}
		updatedProfile.bannedCountries = preset;
		closeModal('presets');
	};

	const handleResetBannedCountries: MouseEventHandler<HTMLButtonElement> = async (event) => {
		const button = event.currentTarget;
		button.disabled = true;
		const { error: e } = await supabase
			.from('profiles')
			.update({ bannedCountries: [] })
			.eq('id', user!.id);
		button.disabled = false;
		if (e) {
			console.error(e);
			return;
		}
		updatedProfile.bannedCountries = [];
	};
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
						if (!usernameRegex.test(updatedProfile.username)) {
							addToast({
								text: 'Username can only contain latin letters and numbers.',
								duration: 5000,
								type: 'error'
							});
							updatedProfile.username = profile.username;
							return;
						}
						if (await isTaken(updatedProfile.username, supabase)) {
							addToast({
								text: 'Username already taken',
								duration: 5000,
								type: 'error'
							});
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
					title="Country"
					values={countries}
					bind:value={updatedProfile.country}
					action={() => updateProfile('country')}
				></ProfileEditor>
				<ProfileEditor
					title="Profile Picture URL"
					bind:value={updatedProfile.image}
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
								class="card relative col-auto w-full shadow-sm transition hover:shadow-xl"
								animate:flip={flipConfig}
							>
								<div class="card-body">
									<div class="mb-2">
										<h2 class="card-title">{aircraft.nickname}</h2>
										<span class="text-light text-sm">{aircraft.tail_number}</span>
									</div>
									<div class="card-actions justify-end">
										<a
											href={addParams(hrefs.aircraft.replace('slug', aircraft.id.toString()), {
												ref: pageUrl.toString()
											})}
											class="btn btn-outline btn-secondary">View</a
										>
										<a
											href={addParams(hrefs.registerAircraft, { id: aircraft.id.toString() })}
											class="btn btn-outline btn-info">Edit</a
										>
										<button
											class="btn btn-outline btn-error"
											onclick={() => {
												currentID = aircraft.id;
												showModal('deleteAircraft');
											}}>Delete</button
										>
									</div>
								</div>
								<div
									class="tooltip absolute top-2 right-2"
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
				<div class="flex flex-col gap-2 sm:flex-row">
					<div class="flex flex-col gap-2">
						<button class="btn btn-outline btn-primary max-w-xs" onclick={updateLogs}>
							Update Logs
							<!-- {#if logUpdate.inProgress}
								<span class="loading loading-spinner"></span>
							{:else if logUpdate.isFinished}
								Logs are up to date
							{:else}
								Update Logs
							{/if} -->
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
					<div class="flex flex-col gap-2 border-s-2 px-2">
						<h2 class="mb-2 text-xl font-bold">Banned Countries</h2>
						<div class="max-h-48 overflow-auto">
							{#each updatedProfile.bannedCountries as bannedCountry (bannedCountry)}
								<div
									animate:flip={flipConfig}
									class="flex w-full items-baseline justify-between rounded bg-gray-200 p-2 py-2 shadow"
								>
									<span>{countries[bannedCountry]}</span>

									<button
										class="btn btn-outline btn-error btn-sm btn-circle"
										aria-label="Delete"
										data-country={bannedCountry}
										onclick={unbanCountry}
									>
										<i class="fa-solid fa-xmark"></i>
									</button>
								</div>
							{/each}
						</div>
						<form class="flex gap-2" onsubmit={banCountry}>
							<LogInput
								id="countryBanInput"
								name="country"
								displayName="Add Country"
								min={2}
								max={2}
								required
								placeholder="Two letter code"
								noValidation
							></LogInput>
							<button type="submit" class="btn btn-primary" disabled={banCountryProgress}>
								Ban Country
							</button>
						</form>
						<div class="grid w-full grid-cols-2 gap-2">
							<button class="btn btn-secondary w-full" onclick={() => showModal('presets')}>
								Show Presets
							</button>
							<button
								onclick={handleResetBannedCountries}
								class="btn btn-outline btn-secondary w-full">Reset Banned Countries</button
							>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</Container>

<!-- Hidden form that sends a request to the server to delete the user's account -->
<form action="?/deleteAccount" method="POST" class="hidden">
	<button bind:this={accountDeleteButton} aria-label="Delete Account" type="submit"></button>
</form>

<Modal id="presets">
	<h1 class="texl-xl mb-2 font-bold">No-fly list for specific countries</h1>
	<div class="grid grid-cols-2 gap-4">
		{#each Object.entries(bannedCountries) as [key, value]}
			<button onclick={handlePreset} data-preset={value.join(',')} class="btn w-full">
				{countries[key]}
			</button>
		{/each}
	</div>
</Modal>
<ConfirmationModal id="passwordReset" href={hrefs.passwordReset}></ConfirmationModal>
<ConfirmationModal
	message="This action cannot be undone."
	id="deleteAccount"
	text={`${profile.username}/account`}
	onconfirmation={handleAccountDelete}
></ConfirmationModal>
<ConfirmationModal
	id="deleteAircraft"
	message="This will also delete all of the logs related to this aircraft."
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
