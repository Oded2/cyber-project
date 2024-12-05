<script lang="ts">
	export let active: boolean = false;
</script>

<button class="btn justify-start" class:btn-active={active}>
	<slot></slot>
</button>
