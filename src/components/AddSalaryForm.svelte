<script lang="ts">
  import { enhance } from '$app/forms';
  import clsx from 'clsx';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let action: string | undefined = undefined;
  export let loading = false;
  export let onSave: SubmitFunction;
  export let onCancel: () => void = () => null;

  let className = '';
  export { className as class };

  const currentLocalDate = new Date().toISOString().slice(0, 10);
</script>

<form method="post" {action} class={clsx('text-center', className)} use:enhance={onSave}>
  <div class="form-control w-full">
    <label for="date" class="label">
      <span class="label-text">Date</span>
    </label>
    <input
      id="date"
      name="date"
      type="date"
      class="input input-bordered"
      value={currentLocalDate}
      required
    />
  </div>

  <div class="form-control w-full mt-3">
    <label for="amount" class="label">
      <span class="label-text">Amount</span>
    </label>

    <label for="amount" class="input input-bordered flex items-center gap-2">
      <span>₱</span>
      <!-- svelte-ignore a11y-autofocus -->
      <input id="amount" name="amount" type="number" step="any" class="grow" autofocus required />
    </label>
  </div>

  <hr class="border-neutral-600 mt-6" />
  <div class="flex justify-center mt-6">
    {#if !loading}
      <button class="btn btn-secondary w-32" on:click|preventDefault={onCancel}>
        <i class="fa-solid fa-xmark" />
        Cancel
      </button>
    {/if}
    <button type="submit" class="btn btn-success w-32 ml-2" disabled={loading}>
      {#if loading}
        <span class="loading loading-dots loading-sm" />
        Saving
      {:else}
        <i class="fa-solid fa-floppy-disk" />
        Save
      {/if}
    </button>
  </div>
</form>
