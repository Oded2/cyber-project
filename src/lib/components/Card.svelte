<script lang="ts">
	let { img, title, description }: { img: string; title: string; description: string } = $props();
</script>

<div class="card h-full w-full">
	<figure class="h-1/2 w-full">
		<img class="max-w-md" src={img} alt={title} />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		<p>{description}</p>
	</div>
</div>
