import { salaryService } from '$lib/services/salary.service';
import { taxService } from '$lib/services/tax.service';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
  const fromDate = url.searchParams.get('from') ?? undefined;
  const toDate = url.searchParams.get('to') ?? undefined;
  const { salaries, totalIncome } = salaryService.list({ fromDate, toDate });
  const { taxableIncome, tax } = taxService.computeWithGraduatedTaxRates(totalIncome);
  return { salaries, totalIncome, taxableIncome, tax };
}) satisfies PageServerLoad;
