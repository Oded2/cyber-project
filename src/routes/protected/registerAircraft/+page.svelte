<script lang="ts">
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addParams, format, hrefs } from '$lib';
	import { page } from '$app/state';

	const { data } = $props();
	const { inputs, aircraft } = data;
	const maxLength = 100;
</script>

<Container>
	<form>
		<div class="card mx-auto mt-5 mb-10 max-w-4xl shadow-xl">
			<div class="card-body">
				<div class="mb-2">
					<h2 class="card-title">
						<a
							aria-label="Back"
							href={addParams(hrefs.settings, { page: 'aircraft' }, page.url.origin)}
							><i class="fa-solid fa-chevron-left"></i></a
						> Register Aircraft
					</h2>
				</div>
				<div class="flex flex-col gap-4">
					{#each inputs as input}
						{#if input.values}
							<AircraftSelect
								originalValue={aircraft ? aircraft[input.name].toString() : ''}
								id={input.name}
								name={input.name}
								values={input.values.map((val) => ({
									id: val,
									display: format(val)
								}))}
								allowOther={input.allowOther}
							></AircraftSelect>
						{:else}
							<AircraftInput
								value={aircraft ? aircraft[input.name].toString() : ''}
								required={input.required}
								id={input.name}
								name={input.name}
								placeholder={input.placeholder!}
								maxLength={input.max ?? maxLength}
								type={input.inputType}
								min={input.min}
								max={input.max}
							></AircraftInput>
						{/if}
					{/each}
					<div class="flex justify-end gap-4">
						<button class="btn btn-info w-full max-w-48" type="submit">Submit</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</Container>

<Title title="Register Aircraft"></Title>
