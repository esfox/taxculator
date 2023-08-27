<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';

	export let onCancel: () => void = () => null;

	const currentLocalDate = new Date().toISOString().slice(0, 10);

	let deductions: number[] = [];
	let saving = false;

	const addDeduction = () => {
		deductions = [...deductions, deductions.length];
	};

	const removeDeduction = (index: number) => {
		deductions = deductions.filter((_, i) => i !== index);
	};

	const onSubmit: SubmitFunction = () => {
		saving = true;
		return ({ update }) => {
			saving = false;
			onCancel();
			update();
		};
	};
</script>

<form method="post" action="?/salary/save" class="text-center" use:enhance={onSubmit}>
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
				autofocus
				required
			/>
		</div>
	</div>

	<div class="mt-6">
		<h5>Deductions</h5>
		{#each deductions as i (i)}
			<div class="flex flex-col items-end bg-neutral-800 p-4 my-4">
				<div class="form-control w-full mt-2">
					<label for="amount" class="label">
						<span class="label-text">Amount</span>
					</label>
					<div class="input-group">
						<span>₱</span>
						<!-- svelte-ignore a11y-autofocus -->
						<input
							id={`deduction-amount-${i}`}
							name={`deduction[${i}].amount`}
							type="number"
							class="input input-bordered"
							autofocus
							required
						/>
					</div>
				</div>
				<div class="form-control w-full mt-2">
					<label for="amount" class="label">
						<span class="label-text">Description</span>
					</label>

					<input
						id={`deduction-description-${i}`}
						name={`deduction[${i}].description`}
						type="text"
						class="input input-bordered"
						required
					/>
				</div>
				<button
					class="btn btn-error btn-sm mt-4"
					on:click|preventDefault={() => removeDeduction(i)}
				>
					<i class="fa-solid fa-trash" />
					Remove
				</button>
			</div>
		{/each}
		<button class="btn btn-primary mt-2" on:click|preventDefault={addDeduction}>
			<i class="fa-solid fa-plus" />
			Add
		</button>
	</div>
	<hr class="border-neutral-600 my-6" />
	<div class="flex justify-center">
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
