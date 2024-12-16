import { TaxPeriodType } from '$lib/constants';
import { salaryService } from '$lib/services/salary.service';
import { taxService } from '$lib/services/tax.service';
import type { TaxPeriodDataType } from '$lib/types';
import dayjs from 'dayjs';
import type { PageServerLoad } from './$types';

export const load = (({ url }) => {
  const taxPeriod = url.searchParams.get('period') ?? undefined;

  const { salaries: allSalaries } = salaryService.list();

  /* Get the tax periods based on the earliest and latest salary dates */
  const salariesSortedByDate = allSalaries.toSorted(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const earliestSalary = salariesSortedByDate[0];
  const latestSalary = salariesSortedByDate[salariesSortedByDate.length - 1];
  let taxPeriods: TaxPeriodDataType[] = [];
  if (earliestSalary && latestSalary) {
    taxPeriods = taxService.getPeriods(earliestSalary.date, latestSalary.date);
  }

  let selectedTaxPeriod: TaxPeriodDataType | undefined = taxPeriods[0];
  if (taxPeriod) {
    selectedTaxPeriod = taxPeriods.find((period) => period.key === taxPeriod) ?? undefined;
  }

  const { totalIncome: incomeInPeriod } = salaryService.list({
    fromDate: selectedTaxPeriod?.dateFrom,
    toDate: selectedTaxPeriod?.dateTo,
  });

  /* Deduct the taxes due of the previous quarters if the selected period is annual */
  if (selectedTaxPeriod?.periodType === TaxPeriodType.Annual) {
    const taxYear = dayjs(selectedTaxPeriod.dateFrom).year();

    /* First quarter */
    const { totalIncome: q1Income } = salaryService.list({
      fromDate: dayjs().year(taxYear).month(0).toString(),
      toDate: dayjs().year(taxYear).month(3).toString(),
    });

    const { tax: q1Tax } = taxService.computeGraduatedIncomeTax(q1Income);

    console.debug(q1Tax);
  }

  console.debug(selectedTaxPeriod);

  const { tax: incomeTax } = taxService.computeGraduatedIncomeTax(incomeInPeriod);
  const percentageTax = taxService.computePercentageTax(incomeInPeriod);
  const totalTax = incomeTax + percentageTax;

  return { incomeTax, percentageTax, totalTax, taxPeriods, income: incomeInPeriod };
}) satisfies PageServerLoad;
