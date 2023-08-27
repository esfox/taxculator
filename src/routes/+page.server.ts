import { salaryService } from '$lib/services/salary.service';
import type { DeductionType } from '$lib/types';
import { fail, type Actions } from '@sveltejs/kit';
import { parseFormData } from 'parse-nested-form-data';
import type { PageServerLoad } from './$types';
import { ExceedingDeductionsError } from '$lib/errors';

export const load = (() => {
	const salaries = salaryService.list();
	const { taxable, tax } = salaryService.computeTax(salaries);
	return { salaries, taxable, tax };
}) satisfies PageServerLoad;

export const actions = {
	'salary/save': async ({ request }) => {
		const formData = await request.formData();
		const data = parseFormData(formData);
		const date = data.date as string;
		const amount = Number(data.amount) as number;
		const deductions = data.deductions as DeductionType[];
		try {
			salaryService.save({ date, amount, deductions });
		} catch (error) {
			if (error instanceof ExceedingDeductionsError) {
				return fail(400, { exceedingDeductions: true });
			}
		}
		return { success: true };
	}
} satisfies Actions;
