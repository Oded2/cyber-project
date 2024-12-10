<script lang="ts">
	import { format } from '$lib';

	const {
		maxLength = 100,
		required = false,
		placeholder,
		name,
		onchange = () => {}
	}: {
		maxLength?: number;
		required?: boolean;
		placeholder: string;
		name: string;
		onchange?: (event: Event) => void;
	} = $props();
</script>

<label class="input input-bordered flex items-center gap-2">
	{format(name)}
	<input
		onblur={onchange}
		type="text"
		{name}
		class="grow"
		{placeholder}
		{required}
		maxlength={maxLength}
	/>
</label>
