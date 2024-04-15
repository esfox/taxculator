<script lang="ts">
  import { enhance } from '$app/forms';
  import clsx from 'clsx';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { ActionData } from '../routes/$types';

  export let onCancel: () => void = () => null;

  let className = '';
  export { className as class };

  const currentLocalDate = new Date().toISOString().slice(0, 10);

  let saving = false;
  let formResult = {} as ActionData;

  const onSubmit: SubmitFunction = () => {
    saving = true;
    return ({ result, update }) => {
      if (result.type === 'failure') {
        formResult = result.data as ActionData;
      }

      saving = false;
      update();
      if (result.type === 'success') {
        onCancel();
      }
    };
  };
</script>

<form
  method="post"
  action="?/salary/save"
  class={clsx('text-center', className)}
  use:enhance={onSubmit}
>
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

    <div class="input-group">
      <span>₱</span>
      <!-- svelte-ignore a11y-autofocus -->
      <input
        id="amount"
        name="amount"
        type="number"
        class="input input-bordered w-full"
        step="any"
        autofocus
        required
      />
    </div>
  </div>

  <hr class="border-neutral-600 mt-6" />
  <div class="flex justify-center mt-6">
    {#if !saving}
      <button class="btn btn-secondary w-32" on:click|preventDefault={onCancel}>
        <i class="fa-solid fa-xmark" />
        Cancel
      </button>
    {/if}
    <button type="submit" class="btn btn-success w-32 ml-2" disabled={saving}>
      {#if saving}
        <span class="loading loading-dots loading-sm" />
        Saving
      {:else}
        <i class="fa-solid fa-floppy-disk" />
        Save
      {/if}
    </button>
  </div>
</form>
