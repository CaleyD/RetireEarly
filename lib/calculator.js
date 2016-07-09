// scenario: {initialPortfolio: NUMBER, annualReturn: NUMBER, withdrawalRate: NUMBER, incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]}

module.exports.calculate = function(scenario) {
  let {withdrawalRate, annualReturn, initialPortfolio, incomePeriods} = scenario;
  if(
    typeof initialPortfolio !== 'number' ||
    typeof annualReturn !== 'number' ||
    typeof withdrawalRate !== 'number' ||
    !Array.isArray(incomePeriods) || incomePeriods.length === 0 ||
    typeof incomePeriods[0].income !== 'number' ||
    typeof incomePeriods[0].expenses !== 'number'
  ) {
    return {error: true};
  }
  // return array of savings for each year until FI
  // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}

  let lastPeriod = incomePeriods[incomePeriods.length-1];
  let retirementPortfolio = lastPeriod.expenses / withdrawalRate;
  let yearsToRetirement = null;
  const annualBalances = [];
  let runningYearsToRetirement = 0;
  let runningPortfolioValue = initialPortfolio;

  // for each bound period (not the last one)
  incomePeriods.slice(0, -1).forEach(({income, expenses}, year) => {
    const yearsTillNextPeriod = getYearsTillNextPeriod(year);
    const yearsToRetirement = getYearsUntilRetirement(
      runningPortfolioValue, income, expenses,
      annualReturn, withdrawalRate);
    if(yearsToRetirement < yearsTillNextPeriod) {
      runningYearsToRetirement += yearsToRetirement;
    } else {
      runningYearsToRetirement += yearsTillNextPeriod;
    }

    for(let i = 0; i < yearsTillNextPeriod; ++i) {
        // this is an estimate - currently assumes all savings added at end of the year in one lump some
        runningPortfolioValue += income - expenses + runningPortfolioValue * annualReturn;
        annualBalances.push(runningPortfolioValue);
    }
  });

  let remainingYearsUntilRetirement = getYearsUntilRetirement(
    runningPortfolioValue, lastPeriod.income, lastPeriod.expenses,
    annualReturn, withdrawalRate);
  yearsToRetirement = runningYearsToRetirement + remainingYearsUntilRetirement;

  for(let i = 0; i < remainingYearsUntilRetirement && i < 200; ++i) {
      // this is an estimate - currently assumes all savings added at end of the year in one lump some
      runningPortfolioValue += lastPeriod.income - lastPeriod.expenses + runningPortfolioValue * annualReturn;
      annualBalances.push(runningPortfolioValue);
  }

  return { retirementPortfolio, yearsToRetirement, annualBalances };

  function getYearsTillNextPeriod(yearIndex) {
    for(var i=yearIndex + 1; i<incomePeriods.length; ++i) {
      if(typeof incomePeriods[i] === 'object') {
        return i - yearIndex;
      }
    }
    return Infinity;
  }
}

function getYearsUntilRetirement(
  initialPortfolio, currentAnnualIncome, currentAnnualExpenses,
  annualReturn, withdrawalRate
) {
  // math ported from https://networthify.com/calculator/earlyretirement
  let numerator;
  let savingsRate = (currentAnnualIncome - currentAnnualExpenses) / currentAnnualIncome;
  if (currentAnnualIncome != 0 && initialPortfolio != 0) {
    numerator = Math.log(
      (
        ((annualReturn * (1 - savingsRate) * currentAnnualIncome) / withdrawalRate) +
        (savingsRate * currentAnnualIncome)
      ) / ((annualReturn * initialPortfolio) + (savingsRate * currentAnnualIncome))
    );
  } else {
    numerator = Math.log((1 - savingsRate) * (1 / withdrawalRate) * (annualReturn / savingsRate) + 1);
  }
  return numerator / Math.log(1 + annualReturn);
}
