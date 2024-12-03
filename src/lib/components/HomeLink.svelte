<script lang="ts">
	export let href: string;
</script>

<a {href} class="btn mx-auto mb-4 w-44 max-w-xs px-5">
	<slot></slot>
</a>
