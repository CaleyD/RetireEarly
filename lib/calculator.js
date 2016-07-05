// scenario: {initialPortfolio: NUMBER, annualReturn: NUMBER, withdrawalRate: NUMBER, incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]}
module.exports.calculate = function(scenario) {
    let {withdrawalRate, annualReturn, initialPortfolio, incomePeriods} = scenario;
    if(
      typeof initialPortfolio !== 'number' ||
      typeof annualReturn !== 'number' ||
      typeof withdrawalRate !== 'number' ||
      !Array.isArray(incomePeriods) || incomePeriods.length === 0
    ) {
      throw new Error('invalid scenario object! ' + JSON.stringify(scenario));
    }
    // return array of savings for each year until FI
    // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}

    let lastPeriod = incomePeriods[incomePeriods.length-1];
    let results = {
      retirementPortfolio: lastPeriod.annualSpending / withdrawalRate,
      yearsToRetirement: null,
      annualBalances: []
    };
    let runningYearsToRetirement = 0;
    let runningPortfolioValue = initialPortfolio;

    // for each bound period (not the last one)
    incomePeriods.slice(0, -1).forEach((period) => {
      let yearsToRetirement = getYearsUntilRetirement(
        runningPortfolioValue, period.annualIncome, period.annualSpending,
        annualReturn, withdrawalRate);
      if(yearsToRetirement < period.years) {
        runningYearsToRetirement += yearsToRetirement;
      } else {
        runningYearsToRetirement += period.years;
      }

      for(let i = 0; i < period.years; ++i) {
          // this is an estimate - currently assumes all savings added at end of the year in one lump some
          runningPortfolioValue += period.annualIncome - period.annualSpending + runningPortfolioValue * annualReturn;
          results.annualBalances.push(runningPortfolioValue);
      }
    });

    let remainingYearsUntilRetirement = getYearsUntilRetirement(
      runningPortfolioValue, lastPeriod.annualIncome, lastPeriod.annualSpending,
      annualReturn, withdrawalRate);
    results.yearsToRetirement = runningYearsToRetirement + remainingYearsUntilRetirement;

    for(let i = 0; i < remainingYearsUntilRetirement && i < 200; ++i) {
        // this is an estimate - currently assumes all savings added at end of the year in one lump some
        runningPortfolioValue += lastPeriod.annualIncome - lastPeriod.annualSpending + runningPortfolioValue * annualReturn;
        results.annualBalances.push(runningPortfolioValue);
    }

    return results;
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
