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

    const periods: TaxPeriodDataType[] = [];

    /* Loop through years and get tax periods */
    let date = from;
    while (date.year() <= to.year()) {
      const year = date.year();

      /* First quarter */
      periods.push({
        key: `${year}-Q1`,
        periodType: TaxPeriodType.FirstQuarter,
        dateFrom: dayjs().year(year).month(0).toString(),
        dateTo: dayjs().year(year).month(3).subtract(1, 'day').toString(),
      });

      /* Second quarter */
      periods.push({
        key: `${year}-Q2`,
        periodType: TaxPeriodType.SecondQuarter,
        dateFrom: dayjs().year(year).month(3).toString(),
        dateTo: dayjs().year(year).month(6).subtract(1, 'day').toString(),
      });

      /* Third quarter */
      periods.push({
        key: `${year}-Q3`,
        periodType: TaxPeriodType.ThirdQuarter,
        dateFrom: dayjs().year(year).month(6).toString(),
        dateTo: dayjs().year(year).month(9).subtract(1, 'day').toString(),
      });

      /* Annual */
      periods.push({
        key: `${year}-A`,
        periodType: TaxPeriodType.Annual,
        dateFrom: dayjs().year(year).month(0).toString(),
        dateTo: dayjs().year(year).month(11).toString(),
      });

      date = date.add(1, 'year');
    }

    return periods.reverse();
  },
};
