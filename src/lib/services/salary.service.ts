import type { SalaryDataType, SalaryType } from '$lib/types';
import { randomUUID } from 'crypto';
import dayjs from 'dayjs';
import { dataStoreService } from './data-store.service';

export const salaryService = {
  list(year?: number): SalaryDataType {
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

    const totalIncome = salaries.reduce((total, salary) => total + salary.amount, 0);
    return {
      salaries: salariesSorted,
      totalIncome
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
  }
};
