import { TaxPeriodType } from '$lib/constants';
import type { TaxPeriodDataType } from '$lib/types';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
dayjs.extend(quarterOfYear);

const graduatedTaxRates = [
  {
    bracket: [250000, 400000],
    percentOffExcess: 0.15,
    fixedRate: 0,
  },
  {
    bracket: [400001, 800000],
    percentOffExcess: 0.2,
    fixedRate: 22500,
  },
  {
    bracket: [800001, 2000000],
    percentOffExcess: 0.25,
    fixedRate: 102500,
  },
  {
    bracket: [2000001, 8000000],
    percentOffExcess: 0.3,
    fixedRate: 402500,
  },
  {
    bracket: [8000001, Infinity],
    percentOffExcess: 0.35,
    fixedRate: 2202500,
  },
];

const percentageTaxRate = 0.03;

const optionalStandardDeduction = 0.4;

export const taxService = {
  computeGraduatedIncomeTax(netIncome: number) {
    const deduction = netIncome * optionalStandardDeduction;
    const taxableIncome = netIncome - deduction;

    let tax = 0;
    for (const spec of graduatedTaxRates) {
      const { bracket, percentOffExcess, fixedRate } = spec;
      const [lowerBound, upperBound] = bracket;
      if (taxableIncome >= lowerBound && taxableIncome <= upperBound) {
        const excessOverLowerBound = taxableIncome - (lowerBound - 1);
        tax = excessOverLowerBound * percentOffExcess;
        tax += fixedRate;
      }
    }

    return { taxableIncome, tax, deduction };
  },
  computePercentageTax(netIncome: number) {
    return netIncome * percentageTaxRate;
  },
  getPeriods(fromDate?: string, toDate?: string) {
    const from = dayjs(fromDate);
    const to = dayjs(toDate);

    if (!from.isValid() || !to.isValid()) {
      throw new Error('Invalid date/s provided');
    }

    const periodTypes = [
      TaxPeriodType.FirstQuarter,
      TaxPeriodType.SecondQuarter,
      TaxPeriodType.ThirdQuarter,
      TaxPeriodType.Annual,
    ];

    const periods: TaxPeriodDataType[] = [];

    /* Loop through years and get tax periods */
    for (let date = from; date.year() <= to.year(); date = date.add(1, 'year')) {
      date = date.set('date', 1);

      const year = date.year();
      const isBeforeToYear = year !== to.year();
      const untilQuarter = isBeforeToYear ? 3 : to.quarter();

      /* Get the tax periods of the first three quarters of the year */
      for (let q = 0; q < untilQuarter; q++) {
        const fromMonth = q * 3;
        periods.push({
          key: `${year}-Q${q + 1}`,
          periodType: periodTypes[q],
          dateFrom: date.set('month', fromMonth).toString(),
          dateTo: date.set('month', fromMonth + 2).toString(),
        });
      }

      if (isBeforeToYear) {
        /* Get the annual tax period */
        periods.push({
          key: `${year}-A`,
          periodType: TaxPeriodType.Annual,
          dateFrom: date.set('month', 0).toString(),
          dateTo: date.set('month', 11).toString(),
        });
      }
    }

    return periods.reverse();
  },
};
