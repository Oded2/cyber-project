<script lang="ts">
	export let img: string;
	export let title: string;
	export let description: string;
</script>

<div class="card h-full w-full">
	<figure class="h-1/2 max-w-52 md:max-w-full">
		<img src={img} alt={title} />
	</figure>
	<div class="card-body">
		<h2 class="card-title">{title}</h2>
		<p>{description}</p>
	</div>
</div>
