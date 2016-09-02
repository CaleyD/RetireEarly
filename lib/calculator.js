'use strict';
// scenario: {
//  initialPortfolio: NUMBER,
//  annualReturn: NUMBER,
//  withdrawalRate: NUMBER,
//  incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]
// }
function calculate (scenario) {
  const {
    withdrawalRate, annualReturn, initialPortfolio, incomePeriods: periods
  } = scenario;

  if (
    typeof initialPortfolio !== 'number' ||
    typeof annualReturn !== 'number' ||
    typeof withdrawalRate !== 'number' ||
    !Array.isArray(periods) || periods.length === 0 ||
    typeof periods[0].income !== 'number' ||
    typeof periods[0].expenses !== 'number'
  ) {
    return { error: true };
  }

  let retirementExpenses;
  const annualBalances = [];
  let runningYearsToRetirement = null;
  let runningPortfolioValue = initialPortfolio;

  periods.forEach((period, year) => {
    if (!period) { return; }
    const savings = period.income - period.expenses;
    const remainingPeriods = periods.slice(year + 1);
    const yearsToNextPeriod = remainingPeriods.findIndex(elem => !!elem) + 1;
    const highestRemainingExpenses = remainingPeriods.
      map(p=>p ? p.expenses : 0).
      reduce(Math.max, period.expenses);
    const yearsToRetirement = getYearsUntilRetirement(
      runningPortfolioValue, savings, highestRemainingExpenses,
      annualReturn, withdrawalRate);

    if (yearsToRetirement > 0) {
      runningYearsToRetirement = year + yearsToRetirement;
      retirementExpenses = highestRemainingExpenses;
    }

    const endIndex = yearsToNextPeriod > 0 ? yearsToNextPeriod : 80 - year;
    for (let i = 0; i < endIndex; ++i) {
      // this is an estimate
      // currently assumes all savings added at end of the year in one lump sum
      runningPortfolioValue += savings + runningPortfolioValue * annualReturn;
      annualBalances.push({
        // no need to track cents
        balance: Math.round(runningPortfolioValue),
        year: year + i
      });
    }
  });

  return {
    retirementPortfolio: Math.round(retirementExpenses / withdrawalRate),
    yearsToRetirement: Math.round(runningYearsToRetirement * 10) / 10,
    annualBalances
  };
}

function getYearsUntilRetirement (
  initialBalance, savings, expenses, roi, withdrawalRate
) {
  return (savings !== 0 || initialBalance !== 0) ?
    Math.log(
      ( roi * expenses / withdrawalRate + savings) /
      ( roi * initialBalance + savings )
    ) / Math.log(1 + roi) : Infinity;
}

const memoizedResults = new WeakMap();

function memoized (scenario) {
  if (!memoizedResults.has(scenario)) {
    memoizedResults.set(scenario, calculate(scenario));
  }
  return memoizedResults.get(scenario);
}

export { calculate, memoized };
