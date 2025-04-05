<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Container from '$lib/components/Container.svelte';
	import FormCard from '$lib/components/FormCard.svelte';
	import LogInput from '$lib/components/LogInput.svelte';

	const { data, form } = $props();

	const { user } = data;
	const success = form?.success;
</script>

<Container>
	<form method="POST">
		<FormCard title="Contact" includeSubmitButton>
			{#if success}
				<h2 class="card-title text-success">Message sent successfully</h2>
			{/if}
			<LogInput
				type="email"
				name="email"
				placeholder="example@domain.com"
				value={user?.email}
				required
				validatorText="Invalid email"
			></LogInput>
			<textarea
				minlength="10"
				name="message"
				class="textarea textarea-bordered w-full resize-none"
				rows="5"
				placeholder="Enter Message"
				required
			></textarea>
		</FormCard>
	</form>
</Container>

<Title title="Contact"></Title>
