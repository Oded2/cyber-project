<script lang="ts">
	const { log, shade }: { log: Log; shade: boolean } = $props();

	function getDuration(date1: Date, date2: Date): string {
		const miliseconds = Math.abs(date1.getTime() - date2.getTime());
		return `${miliseconds / 3600000} Hours, ${(miliseconds / 60000) % 60} Minutes`;
	}
</script>

<div class="grid grid-cols-4 px-3 py-5" class:bg-base-200={shade}>
	<div class="col-auto"><h2 class="font-bold">{log.dep_airport} TO {log.des_airport}</h2></div>
	<div class="col-auto"><h2>{getDuration(log.dep_time, log.des_time)}</h2></div>
</div>
