'use strict';
// scenario: {
//  initialPortfolio: NUMBER,
//  annualReturn: NUMBER,
//  withdrawalRate: NUMBER,
//  incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]
// }
const memoizedResults = new WeakMap();

export function calculate(scenario, doNotMemoize) {
  return memoize(scenario, memoize);
}

function memoize(scenario, doNotMemoize) {
  if (!doNotMemoize && memoizedResults.has(scenario)) {
    return memoizedResults.get(scenario);
  }
  const results = calculate(scenario);
  if (!doNotMemoize) {
    memoizedResults.set(scenario, results);
  }
  return results;
}

function calculate (scenario) {
  const {
    withdrawalRate, annualReturn, initialPortfolio, incomePeriods
  } = scenario;

  if (
    typeof initialPortfolio !== 'number' ||
    typeof annualReturn !== 'number' ||
    typeof withdrawalRate !== 'number' ||
    !Array.isArray(incomePeriods) || incomePeriods.length === 0 ||
    typeof incomePeriods[0].income !== 'number' ||
    typeof incomePeriods[0].expenses !== 'number'
  ) {
    return {error: true, inputs: typeof incomePeriods};
  }

  let retirementExpenses;
  const annualBalances = [];
  let runningYearsToRetirement = 0;
  let runningPortfolioValue = initialPortfolio;

  // for each bound period (not the last one)
  incomePeriods.forEach((period, year) => {
    if (!period) {
      return;
    }
    const savings = period.income - period.expenses;
    const yearsToNextPeriod = getYearsToNextPeriod(year);
    const highestRemainingExpenses = getHighestRemainingExpenses(year);
    const yearsToRetirement = getYearsUntilRetirement(
      runningPortfolioValue, savings, highestRemainingExpenses,
      annualReturn, withdrawalRate);

    if (yearsToRetirement > 0) {
      runningYearsToRetirement += Math.min(yearsToRetirement, yearsToNextPeriod);
      retirementExpenses = highestRemainingExpenses;
    }

    const endIndex = yearsToNextPeriod || 80 - year;
    for (let i = 0; i < endIndex; ++i) {
      // this is an estimate
      // currently assumes all savings added at end of the year in one lump some
      runningPortfolioValue += savings + runningPortfolioValue * annualReturn;
      annualBalances.push({
        balance: runningPortfolioValue,
        year: year + i
      });
    }
  });

  return {
    retirementPortfolio: retirementExpenses / withdrawalRate,
    yearsToRetirement: runningYearsToRetirement,
    annualBalances
  };

  function getYearsToNextPeriod (yearIndex) {
    for (let i = yearIndex + 1; i < incomePeriods.length; ++i) {
      if (incomePeriods[i]) {
        return i - yearIndex;
      }
    }
    return null;
  }

  function getHighestRemainingExpenses (yearIndex) {
    let highestExpenses = 0;
    for (let i = yearIndex; i < incomePeriods.length; ++i) {
      if (incomePeriods[i]) {
        highestExpenses = Math.max(highestExpenses, incomePeriods[i].expenses);
      }
    }
    return highestExpenses;
  }
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
