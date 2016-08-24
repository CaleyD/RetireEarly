'use strict';
// scenario: {initialPortfolio: NUMBER, annualReturn: NUMBER, withdrawalRate: NUMBER, incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]}
const memoizedResults = new WeakMap();

export function calculate(scenario, doNotMemoize) {
  if(!doNotMemoize && memoizedResults.has(scenario)) {
    return memoizedResults.get(scenario);
  }

  const {withdrawalRate, annualReturn, initialPortfolio, incomePeriods} = scenario;

  if(
    typeof initialPortfolio !== 'number' ||
    typeof annualReturn !== 'number' ||
    typeof withdrawalRate !== 'number' ||
    !Array.isArray(incomePeriods) || incomePeriods.length === 0 ||
    typeof incomePeriods[0].income !== 'number' ||
    typeof incomePeriods[0].expenses !== 'number'
  ) {
    return {error: true, inputs: typeof incomePeriods};
  }
  // return array of savings for each year until FI
  // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}

  const retirementExpenses = incomePeriods[incomePeriods.length-1].expenses;
  const retirementPortfolio = retirementExpenses / withdrawalRate;
  const annualBalances = [];
  let runningYearsToRetirement = 0;
  let runningPortfolioValue = initialPortfolio;

  // for each bound period (not the last one)
  incomePeriods.forEach((period, year) => {
    if(!period) {
      return;
    }
    const {income, expenses} = period;
    const yearsTillNextPeriod = getYearsTillNextPeriod(year);
    const yearsToRetirement = getYearsUntilRetirement(
      runningPortfolioValue, income, expenses,
      annualReturn, withdrawalRate);

    runningYearsToRetirement += Math.min(yearsToRetirement, yearsTillNextPeriod);

    const endIndex = Math.min(100,
      yearsTillNextPeriod === Infinity ? yearsToRetirement : yearsTillNextPeriod);
    for(let i = 0; i < endIndex; ++i) {
      // this is an estimate - currently assumes all savings added at end of the year in one lump some
      runningPortfolioValue += income - expenses + runningPortfolioValue * annualReturn;
      annualBalances.push(runningPortfolioValue);
    }
  });

  // calculate values into retirement - at least 80 years from now
  if(annualBalances.length < 80) {
    const {income, expenses} = incomePeriods[incomePeriods.length - 1];
    for(let i = annualBalances.length; i < 80; ++i) {
      // this is an estimate - currently assumes all savings added at end of the year in one lump some
      annualBalances.push(
        annualBalances[annualBalances.length - 1] + income - expenses + annualBalances[annualBalances.length - 1] * annualReturn
      );
    }
  }

  const results = { retirementPortfolio, yearsToRetirement: runningYearsToRetirement, annualBalances };

  if(!doNotMemoize) {
    memoizedResults.set(scenario, results);
  }

  return results;

  function getYearsTillNextPeriod(yearIndex) {
    for(let i=yearIndex + 1; i<incomePeriods.length; ++i) {
      if(typeof incomePeriods[i] === 'object') {
        return i - yearIndex;
      }
    }
    return Infinity;
  }
}

function getYearsUntilRetirement(
  initialPortfolio, annualIncome, annualExpenses, annualReturn, withdrawalRate
) {
  // math ported from https://networthify.com/calculator/earlyretirement
  let numerator;
  const savingsRate = (annualIncome - annualExpenses) / annualIncome;
  if (annualIncome != 0 && initialPortfolio != 0) {
    numerator = Math.log(
      (
        ((annualReturn * (1 - savingsRate) * annualIncome) / withdrawalRate) +
        (savingsRate * annualIncome)
      ) / ((annualReturn * initialPortfolio) + (savingsRate * annualIncome))
    );
  } else {
    numerator = Math.log((1 - savingsRate) * (1 / withdrawalRate) * (annualReturn / savingsRate) + 1);
  }
  return numerator / Math.log(1 + annualReturn);
}
