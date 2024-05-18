import { salaryService } from '$lib/services/salary.service';
import { taxService } from '$lib/services/tax.service';
import { type Actions } from '@sveltejs/kit';
import { parseFormData } from 'parse-nested-form-data';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
  const fromDate = url.searchParams.get('from') ?? undefined;
  const toDate = url.searchParams.get('to') ?? undefined;
  const { salaries, totalIncome } = salaryService.list({ fromDate, toDate });
  const { taxableIncome, tax } = taxService.computeWithGraduatedTaxRates(totalIncome);
  return { salaries, totalIncome, taxableIncome, tax };
}) satisfies PageServerLoad;

export const actions = {
  'salary/save': async ({ request }) => {
    const formData = await request.formData();
    const data = parseFormData(formData);
    const date = data.date as string;
    const amount = Number(data.amount) as number;
    salaryService.save({ date, amount });
    return { success: true };
  }
} satisfies Actions;
