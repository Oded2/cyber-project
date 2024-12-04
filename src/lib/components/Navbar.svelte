<script lang="ts">
	import { hrefs } from '$lib';
	import type { User } from '@supabase/supabase-js';
	import { page } from '$app/stores';

	export let user: User | null;

	$: pathname = $page.url.pathname;

	const navItems = [
		{ href: '/temp', title: 'About' },
		{ href: hrefs.contact, title: 'Contact' },
		{ href: '/temp', title: 'Development' }
	];
</script>

<div class="navbar bg-base-100">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost sm:hidden">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h8m-8 6h16"
					/>
				</svg>
			</div>
			<ul class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
				{#each navItems as item}
					<li><a href={item.href}>{item.title}</a></li>
				{/each}
			</ul>
		</div>
		<a href={hrefs.home} class="btn btn-ghost text-xl">Aerologger</a>
	</div>
	<div class="navbar-center hidden sm:flex">
		<ul class="menu menu-horizontal">
			{#each navItems as item}
				<li><a href={item.href}>{item.title}</a></li>
			{/each}
		</ul>
	</div>
	<div class="navbar-end">
		{#if user}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
					<div class="w-10 rounded-full">
						<img
							alt="Tailwind CSS Navbar component"
							src="https://w7.pngwing.com/pngs/177/551/png-transparent-user-interface-design-computer-icons-default-stephen-salazar-graphy-user-interface-design-computer-wallpaper-sphere-thumbnail.png"
						/>
					</div>
				</div>
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<ul
					tabindex="0"
					class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
				>
					<li>
						<a href="/temp"> Profile </a>
					</li>
					<li><a href="temp">Settings</a></li>
					<li><button on:click>Sign Out</button></li>
				</ul>
			</div>
		{:else if !pathname.includes(hrefs.login)}
			<div class="join">
				<div class="join-item me-2">
					<a href={hrefs.login} class="btn btn-secondary">Log In</a>
				</div>
				<div class="join-item">
					<a href={hrefs.signup} class="btn btn-primary">Sign Up</a>
				</div>
			</div>
		{/if}
	</div>
</div>
