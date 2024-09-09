import type { TaxPeriodType } from './constants';

export type SalaryType = {
  id: string;
  date: string;
  amount: number;
};

export type SalaryDataType = {
  salaries: SalaryType[];
  totalIncome: number;
};

export type TaxPeriodDataType = {
  /* `key` will be the period's year and short name for its period type.
    Example: 
      - 2024-Q1 (2024, first quarter)
      - 2023-Q3 (2023, second quarter)
      - 2022-A (2022, annual) */
  key: string;
  periodType: TaxPeriodType;
  dateFrom: string;
  dateTo: string;
};
