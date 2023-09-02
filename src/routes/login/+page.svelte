<script lang="ts">
	import { applyAction, deserialize } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { ActionResult } from '@sveltejs/kit';
	import type { ActionData } from './$types';

	export let form: ActionData;

	let isLoading = false;

	const handleSubmit = async (event: Event) => {
		const form = event.currentTarget as HTMLFormElement;
		const data = new FormData(form);
		const password = data.get('password')?.toString();
		if (password) {
			data.set('password', window.btoa(password));
		}

		const response = await fetch(form.action, { method: 'POST', body: data });
		const result: ActionResult = deserialize(await response.text());
		if (result.type === 'success') {
			await invalidateAll();
		}

		applyAction(result);
	};
</script>

<form
	method="post"
	action="?/login"
	class="flex flex-col justify-center items-center h-full"
	on:submit|preventDefault={handleSubmit}
>
	<input
		type="password"
		id="password"
		name="password"
		placeholder="Password"
		class="input input-bordered block"
		required
	/>
	{#if form?.invalid}
		<div class="text-error font-medium mt-3">Incorrect password</div>
	{/if}
	<button type="submit" class="btn btn-primary mt-6" disabled={isLoading}>Login</button>
</form>
