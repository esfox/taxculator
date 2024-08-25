<script lang="ts">
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import SalaryList from '$components/SalaryList.svelte';
  import { formatCurrency, debounce } from '$lib/helpers';
  import type { SalaryType } from '$lib/types';
  import type { PageServerData } from './$types';

  export let data: PageServerData;
  $: salaries = data.salaries as SalaryType[];
  $: income = data.totalIncome;
  $: taxable = data.taxableIncome;
  $: tax = data.tax;

  const initialQueryParams = $page.url.searchParams;

  let fromDate: string | undefined = initialQueryParams.get('from') ?? undefined;
  let toDate: string | undefined = initialQueryParams.get('to') ?? undefined;

  $: {
    debounce(() => {
      if (!browser) {
        return;
      }

      const queryParams = new URLSearchParams($page.url.searchParams);
      if (fromDate) {
        queryParams.set('from', fromDate);
      } else {
        queryParams.delete('from');
      }

      if (toDate) {
        queryParams.set('to', toDate);
      } else {
        queryParams.delete('to');
      }

      goto(`?${queryParams.toString()}`);
    }, 1000)();
  }
</script>

<div class="w-full bg-base-100 sticky top-0 pt-16 py-8">
  <div class="sm:w-[500px] grid grid-cols-2 gap-x-4 gap-y-2 mx-auto pb-8">
    <label class="input input-bordered flex items-center gap-2 pr-1">
      <i class="fa fa-calendar-day"></i>
      From
      <input
        bind:value={fromDate}
        type="month"
        class="grow"
        on:click={(e) => e.currentTarget.showPicker()}
      />

      {#if fromDate}
        <button
          class="w-8 h-8 min-h-0 btn btn-ghost rounded-full opacity-70 gap-1 col-span-2 place-self-center p-0"
          on:click={() => (fromDate = undefined)}
        >
          <i class="fa fa-xmark"></i>
        </button>
      {/if}
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <i class="fa fa-calendar-week"></i>
      To
      <input
        bind:value={toDate}
        type="month"
        class="grow"
        on:click={(e) => e.currentTarget.showPicker()}
      />
      {#if toDate}
        <button
          class="w-8 h-8 min-h-0 btn btn-ghost rounded-full opacity-70 gap-1 col-span-2 place-self-center p-0"
          on:click={() => (toDate = undefined)}
        >
          <i class="fa fa-xmark"></i>
        </button>
      {/if}
    </label>
  </div>

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
<SalaryList class="w-full" {salaries} />
<div class="sticky bottom-0 text-center">
  <a href="/income/new">
    <button class="btn btn-primary btn-lg rounded-full shadow-md my-8"> Add Salary </button>
  </a>
</div>
