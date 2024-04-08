import { ExceedingDeductionsError } from '$lib/errors';
import { computeIncomeTax } from '$lib/helpers/tax';
import type { DeductionType, SalaryType } from '$lib/types';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { dataStoreService } from './data-store.service';

export const salaryService = {
  list(year?: number): SalaryType[] {
    const salaryData = dataStoreService.read<SalaryType[]>();
    if (!salaryData) {
      throw new Error('Cannot read data');
    }

    let salaries: SalaryType[] = salaryData;
    if (year) {
      salaries = salaryData.filter((salary) => dayjs(salary.date).year() === year);
    }
    const salariesSorted = salaries.sort((a, b) => {
      const aDate = dayjs(a.date);
      const bDate = dayjs(b.date);
      return bDate.diff(aDate);
    });

    return salariesSorted;
  },
  save({
    id,
    date,
    amount,
    deductions
  }: {
    id?: string;
    date: string;
    amount: number;
    deductions: DeductionType[];
  }) {
    let totalDeductions = 0;
    for (const i in deductions) {
      deductions[i].amount = Number(deductions[i].amount);
      totalDeductions += deductions[i].amount;
    }

    if (totalDeductions > amount) {
      throw new ExceedingDeductionsError();
    }

    const taxable = amount - totalDeductions;
    const salary = { date, amount, deductions, taxable };

    const salaryData = this.list();
    if (id) {
      const salaryIndex = salaryData.findIndex((salary) => salary.id === id);
      if (salaryIndex < 0) {
        throw new Error('Not found');
      }

      salaryData[salaryIndex] = { id, ...salary };
    } else {
      salaryData.push({ id: randomUUID(), ...salary });
    }

    dataStoreService.save(salaryData);
  },
  delete(id: string) {
    const salaryData = this.list();
    const salaryIndex = salaryData.findIndex((salary) => salary.id === id);
    if (salaryIndex < 0) {
      throw new Error('Not found');
    }

    salaryData.splice(salaryIndex, 1);
    dataStoreService.save(salaryData);
  },
  computeTax(salaries: SalaryType[]) {
    let income = 0;
    let taxable = 0;
    for (const salary of salaries) {
      const { amount, deductions } = salary;
      let deductionsTotal = 0;
      if (deductions) {
        deductionsTotal = deductions.reduce((total, deduction) => total + deduction.amount, 0);
      }

      income += amount;
      taxable += amount - deductionsTotal;
    }

    const tax = computeIncomeTax(taxable);
    return { income, taxable, tax };
  }
};
