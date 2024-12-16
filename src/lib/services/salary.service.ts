import type { SalaryDataType, SalaryType } from '$lib/types';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { dataStoreService } from './data-store.service';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export const salaryService = {
  list(params?: { fromDate?: string; toDate?: string }): SalaryDataType {
    const { fromDate, toDate } = params ?? {};

    const salaryData = dataStoreService.read<SalaryType[]>();
    if (!salaryData) {
      throw new Error('Cannot read data');
    }

    let salaries: SalaryType[] = salaryData;
    if (fromDate && dayjs(fromDate).isValid()) {
      salaries = salaryData.filter((salary) => dayjs(salary.date).isSameOrAfter(fromDate, 'month'));
    }

    if (toDate && dayjs(toDate).isValid()) {
      salaries = salaries.filter((salary) => dayjs(salary.date).isSameOrBefore(toDate, 'month'));
    }

    const salariesSorted = salaries.toSorted((a, b) => {
      const aDate = dayjs(a.date);
      const bDate = dayjs(b.date);
      return bDate.diff(aDate);
    });

    const totalIncome = salaries.reduce((total, salary) => total + salary.amount, 0);
    return {
      salaries: salariesSorted,
      totalIncome,
    };
  },
  save({ id, date, amount }: { id?: string; date: string; amount: number }) {
    const salary = { date, amount };

    const { salaries } = this.list();
    if (id) {
      const salaryIndex = salaries.findIndex((salary) => salary.id === id);

      if (salaryIndex < 0) {
        throw new Error('Not found');
      }

      salaries[salaryIndex] = { id, ...salary };
    } else {
      salaries.push({ id: randomUUID(), ...salary });
    }

    dataStoreService.save(salaries);
  },
  delete(id: string) {
    const { salaries } = this.list();
    const salaryIndex = salaries.findIndex((salary) => salary.id === id);
    if (salaryIndex < 0) {
      throw new Error('Not found');
    }

    salaries.splice(salaryIndex, 1);
    dataStoreService.save(salaries);
  },
};
