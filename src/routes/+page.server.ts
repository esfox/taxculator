import { salaryService } from '$lib/services/salary.service';
import type { DeductionType } from '$lib/types';
import type { Actions } from '@sveltejs/kit';
import { parseFormData } from 'parse-nested-form-data';
import type { PageServerLoad } from './$types';

export const load = (() => {
	const salaries = salaryService.list();
	return { salaries };
}) satisfies PageServerLoad;

export const actions = {
	'salary/save': async ({ request }) => {
		const formData = await request.formData();
		const data = parseFormData(formData);
		const date = data.date as string;
		const amount = data.amount as number;
		const deductions = (data?.deductions || []) as DeductionType[];
		salaryService.save({ date, amount, deductions });

		return { success: true };
	}
} satisfies Actions;
