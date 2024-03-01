<script lang="ts">
  import { formatCurrency, formatDate } from '$lib/helpers';
  import type { SalaryType } from '$lib/types';

  let className = '';
  export { className as class };
  export let salaries: SalaryType[];
</script>

<ul class={className}>
  {#each salaries as { id, date, amount, deductions, taxable }, i (id)}
    <li class:mt-8={i !== 0}>
      <div class="flex justify-between items-center gap-6">
        <h3 class="text-2xl font-black text-success">{formatCurrency(amount)}</h3>
        <small>{formatDate(date)}</small>
      </div>
      {#if deductions && deductions.length !== 0}
        <div class="pl-2">
          <small class="block mt-3">Deductions</small>
          <ul class="list-disc list-inside mt-1">
            {#each deductions as deduction}
              <li>
                <strong>{formatCurrency(deduction.amount)}</strong> - {deduction.description}
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </li>
    <div class="flex justify-end items-center gap-2 mt-2">
      <small>Taxable:</small>
      <h4 class="text-md text-red-400 font-bold">{formatCurrency(taxable)}</h4>
    </div>
    <hr class="border-neutral-700 mt-4" />
  {/each}
</ul>
