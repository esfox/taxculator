<script lang="ts">
  import clsx from 'clsx';

  let className = '';
  export { className as class };
  export let fromDate: string | undefined;
  export let toDate: string | undefined;
</script>

<div class={clsx(className, 'grid sm:grid-cols-2 gap-x-4 gap-y-2')}>
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
