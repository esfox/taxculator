const specification = [
	{
		bracket: [250000, 400000],
		percentOffExcess: 0.2,
		fixedRate: 0
	},
	{
		bracket: [400001, 800000],
		percentOffExcess: 0.25,
		fixedRate: 30000
	},
	{
		bracket: [800001, 2000000],
		percentOffExcess: 0.3,
		fixedRate: 130000
	},
	{
		bracket: [2000001, 8000000],
		percentOffExcess: 0.32,
		fixedRate: 490000
	},
	{
		bracket: [8000001, Infinity],
		percentOffExcess: 0.35,
		fixedRate: 2410000
	}
];

export function computeIncomeTax(taxable: number) {
	let tax = 0;
	for (const spec of specification) {
		const { bracket, percentOffExcess, fixedRate } = spec;
		const [lowerBound, upperBound] = bracket;
		if (taxable >= lowerBound && taxable <= upperBound) {
			const excessOverLowerBound = taxable - lowerBound;
			tax = excessOverLowerBound * percentOffExcess;
			tax += fixedRate;
		}
	}
	return tax;
}
