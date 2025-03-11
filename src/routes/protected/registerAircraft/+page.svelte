<script lang="ts">
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import { addParams, hrefs, type FormEvent } from '$lib';
	import { page } from '$app/state';

	const { data } = $props();
	const { inputs, aircraft } = data;
	let submitButton: HTMLButtonElement | null = null;

	let currentStep = $state(0);
	// Boolean to allow instant change of the first option in select attributes from disabled to enabled
	// as formData won't read it if it's disabled
	const maxLength = 100;
	function handleSubmit(e: FormEvent) {
		e.preventDefault();
		currentStep++;
		submitButton?.click();
	}

	// function validate(): void {
	// 	const submitButton = document.getElementById('submit') as HTMLButtonElement;
	// 	// Enables all the disabled options as formData doesn't read disabled option elements
	// 	const disabledOptions = Array.from(document.getElementsByTagName('option'));
	// 	disabledOptions.forEach((option) => (option.disabled = false));
	// 	// For loop iterating all of the inputs
	// 	for (const val of inputs) {
	// 		const element = document.getElementById(val.name) as HTMLInputElement | HTMLSelectElement;
	// 		// Input element
	// 		const valueLength = element.value.length;
	// 		if (valueLength > (val.max ?? maxLength) || (valueLength == 0 && val.required)) {
	// 			// Any input over the maximum length is invalid, but only required inputs cannot be empty
	// 			currentStep = val.page;
	// 			// Sets the current page to the input's page, so the user automatically navigates to the invalidated input
	// 		}
	// 	}
	// 	submitButton.click();
	// 	// Formally submits the form
	// }
</script>

<Container>
	<form onsubmit={handleSubmit}>
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
						{#if input.inputType !== 'select'}
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
						{:else}
							<AircraftSelect
								originalValue={aircraft ? aircraft[input.name].toString() : ''}
								id={input.name}
								name={input.name}
								values={input.values!}
								allowOther={input.allowOther}
							></AircraftSelect>
						{/if}
					{/each}
					<div class="flex justify-end gap-4">
						<button class="btn btn-info w-full max-w-48" type="submit"> Submit </button>
					</div>
				</div>
			</div>
		</div>
	</form>
</Container>

<Title title="Register Aircraft"></Title>
