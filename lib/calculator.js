'use strict';
// scenario: {
//  initialPortfolio: NUMBER,
//  annualReturn: NUMBER,
//  withdrawalRate: NUMBER,
//  incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]
// }

// TODO: would this be simpler to reason about as a recursive function?
export function calculate (scenario) {
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
  let runningYearsToRetirement = 0;
  let runningPortfolioValue = initialPortfolio;

  periods.forEach(({ income, expenses }, year) => {
    const savings = income - expenses;
    const remainingPeriods = periods.slice(year + 1);
    const yearsToNextPeriod = remainingPeriods.findIndex(elem => !!elem) + 1;
    const highestRemainingExpenses =
      remainingPeriods.map(({expenses})=>expenses).reduce(Math.max, expenses);
    const yearsToRetirement = getYearsUntilRetirement(
      runningPortfolioValue, savings, highestRemainingExpenses,
      annualReturn, withdrawalRate);

    if (yearsToRetirement > 0) {
      runningYearsToRetirement += yearsToNextPeriod > 0 ?
        Math.min(yearsToRetirement, yearsToNextPeriod) : yearsToRetirement;
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
  initialBalance, annualSavings, annualExpenses, annualReturn, withdrawalRate
) {
  if (annualSavings !== 0 || initialBalance !== 0) {
    return (
      Math.log(
        ( annualReturn * annualExpenses / withdrawalRate + annualSavings) /
        ( annualReturn * initialBalance + annualSavings )
      ) / Math.log(1 + annualReturn)
    );
  }
  return Infinity;
}

const memoizedResults = new WeakMap();

export function memoized (scenario) {
  if (memoizedResults.has(scenario)) {
    return memoizedResults.get(scenario);
  }
  const results = calculate(scenario);
  memoizedResults.set(scenario, results);
  return results;
}
