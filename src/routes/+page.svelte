<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { hrefs } from '$lib';

	const imgUrl = '/images/wallpaper.jpg';
	const description =
		'A flight logging site like no other. Log past flights, and plan for future flights.';
</script>

<div class="hero min-h-screen" style="background-image: url({imgUrl});">
	<div class="hero-overlay bg-opacity-40"></div>
	<div class="hero-content text-center text-neutral-content">
		<div class=" max-w-xl">
			<h1 class="mb-5 text-5xl font-bold">Welcome to Aerologger</h1>
			<p class="mb-5">
				{description}
			</p>
			<a href={hrefs.signup} class="btn btn-primary">Get Started</a>
			<button
				on:click={() => {
					document.getElementById('test')?.scrollIntoView({ behavior: 'smooth' });
				}}
				class="btn btn-secondary">Learn More</button
			>
		</div>
	</div>
</div>
<div class="hero min-h-screen" id="test">
	<div class="carousel rounded-box">
		<div class="carousel-item">hello world</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
				alt="Burger"
			/>
		</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
				alt="Burger"
			/>
		</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
				alt="Burger"
			/>
		</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp"
				alt="Burger"
			/>
		</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp"
				alt="Burger"
			/>
		</div>
		<div class="carousel-item">
			<img
				src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp"
				alt="Burger"
			/>
		</div>
	</div>
</div>
