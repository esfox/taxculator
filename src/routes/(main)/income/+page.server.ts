import { salaryService } from '$lib/services/salary.service';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
  const fromDate = url.searchParams.get('from') ?? undefined;
  const toDate = url.searchParams.get('to') ?? undefined;
  const { salaries, totalIncome } = salaryService.list({ fromDate, toDate });
  return { salaries, totalIncome };
}) satisfies PageServerLoad;
