<script lang="ts">
  import { browser } from '$app/environment';
  import SalaryList from '$components/SalaryList.svelte';

  import { debounce, formatCurrency, makeQueryParams } from '$lib/helpers';
  import type { SalaryType } from '$lib/types';
  import type { PageServerData } from './$types';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import DateFilters from '$components/DateFilters.svelte';

  export let data: PageServerData;
  $: salaries = data.salaries as SalaryType[];
  $: income = data.totalIncome;

  const initialQueryParams = $page.url.searchParams;

  let fromDate: string | undefined = initialQueryParams.get('from') ?? undefined;
  let toDate: string | undefined = initialQueryParams.get('to') ?? undefined;

  $: {
    debounce(() => {
      if (!browser) {
        return;
      }

      const queryParams = makeQueryParams({ from: fromDate, to: toDate }, initialQueryParams);
      goto(`?${queryParams.toString()}`);
    }, 1000)();
  }
</script>

<main class="grid place-items-center overflow-auto px-8 md:px-32 lg:px-48 xl:px-96">
  <div class="w-full bg-base-100 sticky top-0 pt-8 pb-6">
    <DateFilters bind:fromDate bind:toDate class="sm:w-[500px] mx-auto" />
    <div class="pt-6 text-green-300">
      <h4 class="text-center text-lg font-medium">Total Income</h4>
      <h2 class="text-center md:text-3xl text-2xl font-black">{formatCurrency(income)}</h2>
    </div>
  </div>
  <SalaryList class="w-full" {salaries} />
  <div class="sticky bottom-0 text-center">
    <a href="/income/new">
      <button class="btn btn-primary rounded-full shadow-md my-8"> Add Salary </button>
    </a>
  </div>
</main>
