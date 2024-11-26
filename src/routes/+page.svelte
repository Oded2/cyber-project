<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { hrefs } from '$lib';
	import Card from '$lib/components/Card.svelte';
	import creativity from '$lib/images/Creativity.svg';
	import calendar from '$lib/images/Calendar.svg';
	import map from '$lib/images/Map.svg';

	const imgUrl =
		'https://raw.githubusercontent.com/Oded2/Aerologger/refs/heads/main/src/lib/images/logo_simplified.png';
	const description =
		'A flight logging site like no other. Log past flights, and plan for future flights.';
</script>

<main class="py-10">
	<div class="hero mb-10 bg-base-200">
		<div class="hero-content flex-col lg:flex-row-reverse">
			<img alt="Logo" src={imgUrl} class="max-w-sm rounded-lg shadow-2xl" />
			<div>
				<h1 class="text-5xl font-bold">Elevate Your Logbook!</h1>
				<p class="py-6">
					{description}
				</p>
				<a href={hrefs.signup} class="btn btn-primary">Get Started</a>
				<button
					on:click={() => document.getElementById('info')?.scrollIntoView({ behavior: 'smooth' })}
					class="btn btn-secondary">Learn More</button
				>
			</div>
		</div>
	</div>
	<Container>
		<div class="grid grid-cols-3 place-items-center" id="info">
			<div class="col-auto h-full w-full">
				<Card
					img={creativity}
					title="Log your flights, fast and easy."
					description="With Aerologger, you can log your flights in a very simple and quick process. Aerologger's technology will then get as much information about your flight as it can, such as weather, flight route, and more!"
				></Card>
			</div>
			<div class="col-auto h-full w-full">
				<Card
					img={calendar}
					title="Stay updated."
					description="Have a flight in two days? No problem. Simply plan a future flight and your pilot's calendar will update. Want to know your past flights? They will show up there as well."
				></Card>
			</div>
			<div class="col-auto h-full w-full">
				<Card
					img={map}
					title="Plan future flights."
					description="This isn't just a logbook. Aerologger is also a flight planning application. Given your future takeoff time & date, Aerologger will automatically add it to your calendar, plan a route for you based on weather and airspace restrictions, and alert you of any possible delays."
				></Card>
			</div>
		</div>
	</Container>
</main>
