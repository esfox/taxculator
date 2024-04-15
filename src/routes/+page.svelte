<script lang="ts">
  import AddSalaryForm from '$components/AddSalaryForm.svelte';
  import SalaryList from '$components/SalaryList.svelte';
  import { formatCurrency } from '$lib/helpers';
  import type { SalaryType } from '$lib/types';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: salaries = data.salaries as SalaryType[];
  $: income = data.totalIncome;
  $: taxable = data.taxableIncome;
  $: tax = data.tax;

  let isAddingSalary = false;

  const toggleAddingSalary = () => (isAddingSalary = !isAddingSalary);
</script>

<main class="h-full grid place-items-center">
  <section class="w-full px-4 md:px-32 lg:px-48 xl:px-96">
    {#if isAddingSalary}
      <AddSalaryForm class="w-80 mx-auto" onCancel={toggleAddingSalary} />
    {:else}
      <div class="bg-base-100 sticky top-0 pt-16 pb-8">
        <div class="w-full md:w-2/3 grid grid-cols-2 mx-auto">
          <div class="text-green-300">
            <h4 class="text-center md:text-md font-medium">Total Income</h4>
            <h3 class="text-center md:text-2xl text-xl font-black">{formatCurrency(income)}</h3>
          </div>
          <div class="text-orange-300">
            <h4 class="text-center md:text-md font-medium">Total Taxable</h4>
            <h2 class="text-center md:text-2xl text-xl font-black">{formatCurrency(taxable)}</h2>
          </div>
        </div>
        <h4 class="text-center text-lg text-red-400 font-bold mt-5">Tax Due</h4>
        <h1 class="text-center text-4xl text-red-400 font-black mt-1">{formatCurrency(tax)}</h1>
      </div>
      <SalaryList {salaries} />
      <div class="sticky bottom-0 text-center">
        <button class="btn btn-primary rounded-full shadow-md my-8" on:click={toggleAddingSalary}
          >Add Salary</button
        >
      </div>
    {/if}
  </section>
</main>
