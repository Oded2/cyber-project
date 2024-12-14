<script lang="ts">
	import AircraftInput from '$lib/components/AircraftInput.svelte';
	import AircraftSelect from '$lib/components/AircraftSelect.svelte';
	import Container from '$lib/components/Container.svelte';
	import Title from '$lib/components/Title.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import { addParams, hrefs } from '$lib';
	import { page } from '$app/stores';

	const { data } = $props();
	const { inputs, aircraft } = data;

	let currentStep = $state(0);
	// Boolean to allow instant change of the first option in select attributes from disabled to enabled
	// as formData won't read it if it's disabled
	const maxLength = 100;
	const steps = [
		'Basic Details',
		'Technical Specifications (1/2)',
		'Technical Specifications (2/2)',
		'More Details'
	];

	function validate(): void {
		// Enables all the disabled options as formData doesn't read disabled option elements
		const disabledOptions = Array.from(document.getElementsByTagName('option'));
		disabledOptions.forEach((option) => (option.disabled = false));
		// For loop iterating all of the inputs
		for (const val of inputs) {
			const element = document.getElementById(val.name) as HTMLInputElement | HTMLSelectElement;
			// Input element
			const valueLength = element.value.length;
			if (valueLength > maxLength || (valueLength == 0 && val.required)) {
				// Any input over the maximum length is invalid, but only required inputs cannot be empty
				element.parentElement?.classList.add('input-error');
				currentStep = val.page;
				// Sets the current page to the input's page, so the user automatically navigates to the invalidated input
				return;
			}
		}
		document.getElementById('submit')?.click();
		// Formally submits the form
	}
</script>

<main>
	<Container>
		<form method="POST">
			<!-- Hidden submit button that actually submits the form -->
			<button class="hidden" aria-label="Submit" id="submit" type="submit"></button>
			<div class="card mx-auto mb-10 mt-5 max-w-4xl shadow-xl">
				<div class="card-body">
					<div class="mb-2">
						<h2 class="card-title">
							<a
								aria-label="Back"
								href={addParams(hrefs.settings, { page: 'aircraft' }, $page.url.origin)}
								><i class="fa-solid fa-chevron-left"></i></a
							> Register Aircraft
						</h2>
					</div>
					<ul class="steps mb-2">
						{#each steps as step, index}
							<li class="step" class:step-info={index <= currentStep}>{step}</li>
						{/each}
					</ul>
					<div class="flex flex-col gap-4">
						{#each inputs as input}
							<div hidden={currentStep != input.page}>
								<!-- The hidden attribute allows only the questions that are supposed to appear according to the page number appear -->
								{#if input.inputType === 'text'}
									<AircraftInput
										value={aircraft ? aircraft[input.name].toString() : ''}
										required={input.required}
										id={input.name}
										name={input.name}
										placeholder={input.placeholder!}
									></AircraftInput>
								{:else if input.inputType === 'select'}
									<AircraftSelect
										value={aircraft ? aircraft[input.name].toString() : ''}
										id={input.name}
										name={input.name}
										values={input.values!}
										allowOther={input.allowOther}
									></AircraftSelect>
								{:else if input.inputType === 'number'}
									<NumberInput
										value={aircraft ? aircraft[input.name].toString() : ''}
										min={input.min!}
										max={input.max!}
										name={input.name}
										id={input.name}
										placeholder={input.placeholder}
									></NumberInput>
								{/if}
							</div>
						{/each}
						<div class="flex gap-4">
							{#if currentStep != 0}
								<button
									type="button"
									class="btn btn-outline btn-info me-auto w-full max-w-48"
									onclick={() => currentStep--}>Back</button
								>
							{/if}
							{#if currentStep == steps.length - 1}
								<button
									type="button"
									class="btn btn-info ms-auto w-full max-w-48"
									onclick={() => validate()}>Submit</button
								>
							{:else}
								<button
									type="button"
									class="btn btn-info ms-auto w-full max-w-48"
									onclick={() => currentStep++}>Next</button
								>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</form>
	</Container>
</main>

<Title title="Register Aircraft"></Title>
