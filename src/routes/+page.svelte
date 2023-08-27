<script lang="ts">
	import AddSalaryForm from '$components/AddSalaryForm.svelte';
	import SalaryList from '$components/SalaryList.svelte';
	import type { SalaryType } from '$lib/types';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const salaries = data.salaries as SalaryType[];

	let isAddingSalary = false;

	const toggleAddingSalary = () => (isAddingSalary = !isAddingSalary);
</script>

<main class="h-full grid place-items-center">
	<section class="w-full px-4 sm:px-96">
		{#if isAddingSalary}
			<AddSalaryForm onCancel={toggleAddingSalary} />
		{:else}
			<SalaryList {salaries} />
			<div class="text-center">
				<button class="btn btn-primary mt-8" on:click={toggleAddingSalary}> Add Salary </button>
			</div>
		{/if}
	</section>
</main>
