const graduatedTaxRates = [
  {
    bracket: [250000, 400000],
    percentOffExcess: 0.15,
    fixedRate: 0
  },
  {
    bracket: [400001, 800000],
    percentOffExcess: 0.2,
    fixedRate: 22500
  },
  {
    bracket: [800001, 2000000],
    percentOffExcess: 0.25,
    fixedRate: 102500
  },
  {
    bracket: [2000001, 8000000],
    percentOffExcess: 0.3,
    fixedRate: 402500
  },
  {
    bracket: [8000001, Infinity],
    percentOffExcess: 0.35,
    fixedRate: 2202500
  }
];

const optionalStandardDeduction = 0.4;

export const taxService = {
  computeWithGraduatedTaxRates(netIncome: number) {
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
  }
};
