export type DeductionType = {
	amount: number;
	description: string;
};

export type SalaryType = {
	id: string;
	date: string;
	amount: number;
	deductions: DeductionType[];
	taxable?: number;
};
