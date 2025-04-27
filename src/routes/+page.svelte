<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { handleLogs, hrefs } from '$lib';
	import creativity from '$lib/images/Creativity.svg';
	import calendar from '$lib/images/Calendar.svg';
	import map from '$lib/images/Map.svg';
	import Title from '$lib/components/Title.svelte';
	import logo from '$lib/images/logo.png';
	import HomeLink from '$lib/components/HomeLink.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();
	const description =
		'A flight logging site like no other. Log past flights, and plan for future flights.';
	const { user, redirect, supabase } = data;
	const today = new Date();

	const futureLogsPromise = fetchFutureLogs();

	let hero: HTMLDivElement | null = $state(null);

	onMount(() => {
		if (redirect) goto(redirect);
		hero?.scrollIntoView({ behavior: 'instant' });
	});

	async function fetchFutureLogs(): Promise<Log[]> {
		if (!user) return [];
		const { data: temp } = await supabase.from('logs').select().eq('owner', user.id);
		let logs = temp as Log[];
		handleLogs(logs);
		logs = logs.filter((item) => item.dep_time > today);
		logs.reverse();
		return logs;
	}
</script>

<main>
	{#if user}
		<div
			bind:this={hero}
			class="hero min-h-screen place-items-start"
			style="background-image: url(/background.jpg);"
		>
			<div class="hero-overlay bg-opacity-30"></div>
			<div class="grid h-full w-full grid-cols-3 gap-20 p-5 text-center sm:p-10 md:p-40">
				<div class="card glass col-auto max-h-72 p-5">
					<h1 class="text-neutral-content mb-5 text-2xl font-bold">Upcoming Flights</h1>
					<div class="flex flex-col overflow-auto">
						{#await futureLogsPromise}
							<span class="loading loading-spinner loading-lg text-neutral-content mx-auto"></span>
						{:then futureLogs}
							{#if futureLogs.length > 0}
								<div class="flex flex-col gap-4">
									{#each futureLogs as log}
										<div class="rounded-lg bg-black/20 p-5">
											<h2 class="text-neutral-content font-semibold">
												{`${log.dep_airport.icao_code} TO ${log.des_airport.icao_code}`}
											</h2>
											<h4 class="text-neutral-content text-sm font-semibold">
												{`${log.dep_time.toLocaleString('en-US', { month: 'short', day: 'numeric', weekday: 'long', hour: 'numeric', minute: 'numeric' })}`}
											</h4>
										</div>
									{/each}
								</div>
							{:else}
								<h2 class="text-neutral-content font-semibold">No flights coming up</h2>
							{/if}
						{:catch}
							<h2 class="text-neutral-content font-semibold">Error Encountered</h2>
						{/await}
					</div>
				</div>
				<div class="col-auto mx-auto flex max-w-md flex-col">
					<h1 class="text-neutral-content mb-5 text-5xl font-bold">Hello Pilot</h1>
					<div class="prose mb-5 bg-white/15">
						<blockquote class="p-1 text-white">
							<!-- Daily quote -->
							"A mile of road takes you a mile. A mile of runaway takes you anywhere."
						</blockquote>
					</div>
					<HomeLink href={hrefs.log}><i class="fa-solid fa-plane"></i>Log New Flight</HomeLink>
					<HomeLink href={hrefs.calendar}
						><i class="fa-solid fa-calendar-days"></i>View Calendar</HomeLink
					>
					<HomeLink href={hrefs.logbook}><i class="fa-solid fa-book"></i>View Logbook</HomeLink>
				</div>
			</div>
		</div>
	{:else}
		<div class="hero bg-base-200 mb-10">
			<div class="hero-content flex-col lg:flex-row-reverse">
				<img alt="Logo" src={logo} class="max-w-sm rounded-lg" />
				<div>
					<h1 class="text-5xl font-bold">Elevate Your Logbook!</h1>
					<p class="py-6">
						{description}
					</p>
					<a href={hrefs.signup} class="btn btn-primary">Get Started</a>
					<button
						onclick={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
						class="btn btn-secondary">Learn More</button
					>
				</div>
			</div>
		</div>
		<Container>
			<div class="place-items-center md:grid md:grid-cols-2 xl:grid-cols-3" id="info">
				<div class="col-auto h-full">
					{@render Card(
						creativity,
						'Log your flights, fast and easy.',
						"With Aerologger, you can log your flights in a very simple and quick process. Aerologger's technology will then get as much information about your flight as it can, such as weather, flight route, and more!"
					)}
				</div>
				<div class="col-auto h-full">
					{@render Card(
						calendar,
						'Stay updated.',
						"Have a flight in a few days? No problem. Simply plan a future flight and your pilot's calendar will update. Want to know your past flights? They will show up there as well."
					)}
				</div>
				<div class="col-span-2 h-full xl:col-auto">
					{@render Card(
						map,
						'Plan for future flights.',
						"This isn't just a logbook. Aerologger is also a flight planning application. Given your future takeoff time and date, Aerologger will automatically add it to your calendar, plan a route for you based on weather and airspace restrictions, and alert you of any possible delays."
					)}
				</div>
			</div>
		</Container>
	{/if}
</main>

{#snippet Card(img: string, title: string, description: string)}
	<div class="card h-full w-full">
		<figure class="h-1/2 w-full">
			<img class="max-w-md" src={img} alt={title} />
		</figure>
		<div class="card-body">
			<h2 class="card-title">{title}</h2>
			<p>{description}</p>
		</div>
	</div>
{/snippet}

<Title title={'Aerologger'}></Title>
