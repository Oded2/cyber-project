<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import LogEntries from './LogEntries.svelte';
	import Calendar from './Calendar.svelte';

	const {
		logs,
		aircrafts,
		title,
		edit = false,
		defaultShowEntries = true,
		supabase
	}: {
		logs: Log[];
		aircrafts: Aircraft[];
		title: string;
		edit?: boolean;
		defaultShowEntries?: boolean;
		supabase: SupabaseClient;
	} = $props();

	let showEntries: boolean = $state(defaultShowEntries);
</script>

<div class="flex items-center gap-4">
	<div class="join">
		<button
			class="btn join-item"
			class:btn-active={showEntries}
			onclick={() => (showEntries = true)}
			aria-label="Logbook"
		>
			<i class="fa-solid fa-book"></i>
		</button>
		<button
			class="btn join-item"
			class:btn-active={!showEntries}
			onclick={() => (showEntries = false)}
			aria-label="Calendar"
		>
			<i class="fa-solid fa-calendar-days"></i>
		</button>
	</div>
	<h1 class="mt-5 border-b-2 pb-2 text-xl font-bold">{title}</h1>
</div>
{#if showEntries}
	<LogEntries originalLogs={logs} {aircrafts} {supabase} {edit}></LogEntries>
{:else}
	<Calendar originalLogs={logs} {supabase} {edit}></Calendar>
{/if}
