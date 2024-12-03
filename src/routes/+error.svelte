<script lang="ts">
	import { page } from '$app/stores';

    const errorMessage = $page.error?.message ?? "";
</script>

<h1>Expected Error</h1>
<h1>{errorMessage}</h1>