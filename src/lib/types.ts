export type SalaryType = {
  id: string;
  date: string;
  amount: number;
};

export type SalaryDataType = {
  salaries: SalaryType[];
  totalIncome: number;
};
