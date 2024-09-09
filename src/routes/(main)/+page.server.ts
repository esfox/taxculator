import { salaryService } from '$lib/services/salary.service';
import { taxService } from '$lib/services/tax.service';
import type { TaxPeriodDataType } from '$lib/types';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
  const taxPeriod = url.searchParams.get('period') ?? undefined;

  const { salaries: allSalaries } = salaryService.list();

  /* Get the tax periods based on the earliest and latest salary dates */
  const salariesSortedByDate = allSalaries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const earliestSalary = allSalaries[0];
  const latestSalary = allSalaries[salariesSortedByDate.length - 1];
  let taxPeriods: TaxPeriodDataType[] = [];
  if (earliestSalary && latestSalary) {
    taxPeriods = taxService.getPeriods(earliestSalary.date, latestSalary.date);
  }

  let selectedTaxPeriod: TaxPeriodDataType | undefined = taxPeriods[0];
  if (taxPeriod) {
    selectedTaxPeriod = taxPeriods.find((period) => period.key === taxPeriod) ?? undefined;
  }

  const { totalIncome } = salaryService.list({
    fromDate: selectedTaxPeriod?.dateFrom,
    toDate: selectedTaxPeriod?.dateTo,
  });

  const { tax } = taxService.computeWithGraduatedTaxRates(totalIncome);

  return { tax, taxPeriods, income: totalIncome };
}) satisfies PageServerLoad;
