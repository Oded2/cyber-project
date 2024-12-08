<script lang="ts">
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

<div>
	<label class="input input-bordered flex items-center gap-2">
		{name
			.split('_')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')}
		<input
			{onchange}
			type="text"
			{name}
			class="grow"
			{placeholder}
			{required}
			maxlength={maxLength}
		/>
	</label>
</div>
