<script lang="ts">
	import Title from '$lib/components/Title.svelte';
	import Container from '$lib/components/Container.svelte';
</script>

<main>
	<Container>
		<form action="?/send" method="POST">
			<div class="prose">
				Email
				<input type="email" name="email" />
				Message
				<textarea name="message"></textarea>
				<button class="btn btn-primary">Click me</button>
			</div>
		</form>
	</Container>
</main>
<Title title="Contact"></Title>
