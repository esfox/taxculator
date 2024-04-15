<script lang="ts">
  import { formatCurrency, formatDate } from '$lib/helpers';
  import type { SalaryType } from '$lib/types';

  let className = '';
  export { className as class };
  export let salaries: SalaryType[];
</script>

<ul class={className}>
  {#each salaries as { id, date, amount }, i (id)}
    <li class:mt-8={i !== 0}>
      <div class="flex justify-between items-center gap-6">
        <h3 class="text-2xl font-black text-success">{formatCurrency(amount)}</h3>
        <small>{formatDate(date)}</small>
      </div>
    </li>
    <hr class="border-neutral-700 mt-4" />
  {/each}
</ul>
