<script lang="ts">
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import { invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { error } from '@sveltejs/kit';
	import { hrefs } from '$lib';
	import { page } from '$app/state';
	import Dropdown from '$lib/components/Dropdown.svelte';

	const { children, data } = $props();
	// possible issue
	const { supabase, session, user, profile } = data;

	let status = $derived(page.status);
	let pathname = $derived(page.url.pathname);

	const navItems = [
		{ href: hrefs.contact, title: 'Contact' },
		{ href: hrefs.search, title: 'Search' },
		{ href: '/temp', title: 'Development' }
	];

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				// TODO: Explain this
				invalidate('supabase:auth');
			}
			if (event === 'SIGNED_OUT') window.location.href = hrefs.home;
		});

		return () => data.subscription.unsubscribe();
	});

	async function handleSignOut(): Promise<void> {
		const { error: e } = await supabase.auth.signOut();
		if (e) error(e.status ?? 400, { message: e.message });
	}
</script>

{#if status == 200}
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
				<ul
					class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
				>
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
							<img alt="Profile" src={profile.image} id="profilePicture" />
						</div>
					</div>
					<Dropdown>
						<li>
							<a
								href={hrefs.profile.replace('slug', profile.username)}
								data-sveltekit-reload={pathname.startsWith('/profile')}
							>
								Profile
							</a>
						</li>
						<li><a href={hrefs.settings}>Settings</a></li>
						<li><button onclick={handleSignOut}>Sign Out</button></li>
					</Dropdown>
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
{/if}

{@render children()}
