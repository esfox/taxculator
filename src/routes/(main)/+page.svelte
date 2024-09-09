<script lang="ts">
  import { formatCurrency, makeQueryParams } from '$lib/helpers';
  import dayjs from 'dayjs';
  import type { PageServerData } from './$types';
  import { TaxPeriodType } from '$lib/constants';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  const periodTypeLabelMap = {
    [TaxPeriodType.FirstQuarter]: '1st Quarter',
    [TaxPeriodType.SecondQuarter]: '2nd Quarter',
    [TaxPeriodType.ThirdQuarter]: '3rd Quarter',
    [TaxPeriodType.Annual]: 'Annual',
  };

  export let data: PageServerData;
  $: tax = data.tax;
  $: income = data.income;
  $: taxPeriods = data.taxPeriods.map((period) => {
    const fromDate = dayjs(period.dateFrom);
    const periodTypeText = `${fromDate.year()}, ${periodTypeLabelMap[period.periodType]}`;
    const fromDateText = fromDate.format('MMMM');
    const toDateText = dayjs(period.dateTo).format('MMMM');
    return {
      key: period.key,
      label: `${periodTypeText} (${fromDateText} - ${toDateText})`,
    };
  });

  const initialQueryParams = $page.url.searchParams;

  let selectedTaxPeriodKey: string;

  $: {
    if (browser && selectedTaxPeriodKey) {
      const queryParams = makeQueryParams({ period: selectedTaxPeriodKey }, initialQueryParams);
      goto(`?${queryParams.toString()}`);
    }
  }
</script>

<main class="flex flex-col justify-center items-center gap-5">
  <div class="text-green-400">
    <h4 class="text-center text-sm font-bold">Income</h4>
    <h1 class="text-center text-2xl font-black mt-1">{formatCurrency(income)}</h1>
  </div>
  <div class="text-red-400">
    <h2 class="text-center text-lg font-bold">Income Tax</h2>
    <h1 class="text-center text-4xl font-black mt-1">{formatCurrency(tax)}</h1>
  </div>
  <select
    bind:value={selectedTaxPeriodKey}
    name="period"
    id="period"
    class="select select-bordered mt-2"
  >
    {#each taxPeriods as period}
      <option value={period.key}>{period.label}</option>
    {/each}
  </select>
</main>
