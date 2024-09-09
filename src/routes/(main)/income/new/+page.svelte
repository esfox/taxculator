<script lang="ts">
  import { goto } from '$app/navigation';
  import AddSalaryForm from '$components/AddSalaryForm.svelte';
  import type { SubmitFunction } from '@sveltejs/kit';

  let saving = false;

  const onSave: SubmitFunction = () => {
    saving = true;
    return ({ result }) => {
      if (result.type === 'success') {
        goSalariesList();
      }

      saving = false;
    };
  };
  const goSalariesList = () => goto('/');
</script>

<AddSalaryForm class="sm:w-80 mx-auto" loading={saving} {onSave} onCancel={goSalariesList} />
