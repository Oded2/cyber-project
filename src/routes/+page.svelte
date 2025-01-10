<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { hrefs } from '$lib';
	import Card from '$lib/components/Card.svelte';
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
	const { user, redirect } = data;
	// Daily image
	const imgUrl = 'https://wallpaperswide.com/download/airplane_3-wallpaper-2560x1440.jpg';
	onMount(() => {
		if (redirect.length > 0) goto(redirect);
		document.getElementById('hero')?.scrollIntoView({ behavior: 'instant' });
	});
</script>

<main>
	{#if user}
		<div
			id="hero"
			class="hero min-h-screen place-items-start"
			style="background-image: url({imgUrl});"
		>
			<div class="hero-overlay bg-opacity-30"></div>
			<div class="flex h-full w-full flex-col justify-end p-5 text-center sm:p-10 md:p-40">
				<div class="mx-auto mb-auto flex max-w-md flex-col">
					<h1 class="mb-5 text-5xl font-bold text-neutral-content">Hello Pilot</h1>
					<div class="prose mb-5 bg-white bg-opacity-15">
						<blockquote class="text-white">
							<!-- Daily quote -->
							"A mile of road takes you a mile. A mile of runaway takes you anywhere."
						</blockquote>
					</div>
					<HomeLink href={hrefs.log}><i class="fa-solid fa-plane"></i>Log New Flight</HomeLink>
					<HomeLink href={hrefs.calendar}><i class="fa-solid fa-clock"></i>View Calendar</HomeLink>
					<HomeLink href={hrefs.logbook}><i class="fa-solid fa-book"></i>View Logbook</HomeLink>
				</div>
			</div>
		</div>
	{:else}
		<div class="hero mb-10 bg-base-200">
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
					<Card
						img={creativity}
						title="Log your flights, fast and easy."
						description="With Aerologger, you can log your flights in a very simple and quick process. Aerologger's technology will then get as much information about your flight as it can, such as weather, flight route, and more!"
					></Card>
				</div>
				<div class="col-auto h-full">
					<Card
						img={calendar}
						title="Stay updated."
						description="Have a flight in a few days? No problem. Simply plan a future flight and your pilot's calendar will update. Want to know your past flights? They will show up there as well."
					></Card>
				</div>
				<div class="col-span-2 h-full xl:col-auto">
					<Card
						img={map}
						title="Plan future flights."
						description="This isn't just a logbook. Aerologger is also a flight planning application. Given your future takeoff time and date, Aerologger will automatically add it to your calendar, plan a route for you based on weather and airspace restrictions, and alert you of any possible delays."
					></Card>
				</div>
			</div>
		</Container>
	{/if}
</main>

<Title title={'Aerologger'}></Title>
