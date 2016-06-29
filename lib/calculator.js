// scenario: {initialPortfolioValue: NUMBER, annualReturnRate: NUMBER, withdrawalRate: NUMBER, incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]}
module.exports.calculate = function(scenario) {
    if(
      typeof scenario.initialPortfolioValue !== 'number' ||
      typeof scenario.annualReturn !== 'number' ||
      typeof scenario.withdrawalRate !== 'number' ||
      !Array.isArray(scenario.incomePeriods) ||
      scenario.incomePeriods.length === 0
    ) {
      throw new Error('invalid scenario object! ' + JSON.stringify(scenario));
    }
    // return array of savings for each year until FI
    // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}

    var withdrawalRate = scenario.withdrawalRate;
    var annualReturnRate = scenario.annualReturn;
    var initialPortfolioValue = scenario.initialPortfolioValue;
    var incomePeriods = scenario.incomePeriods;
    var lastPeriod = incomePeriods[incomePeriods.length-1];

    var results = {
      retirementPortfolioValue: lastPeriod.annualSpending / withdrawalRate,
      yearsToRetirement: null,
      annualBalances: []
    };

    var runningYearsToRetirement = 0;
    var runningPortfolioValue = initialPortfolioValue;

    // for each bound period (not the last one)
    incomePeriods.slice(0, -1).forEach((period) => {
      let yearsToRetirement = getYearsUntilRetirement(
        runningPortfolioValue, period.annualIncome, period.annualSpending,
        annualReturnRate, withdrawalRate);
      if(yearsToRetirement < period.years) {
        runningYearsToRetirement += yearsToRetirement;
      } else {
        runningYearsToRetirement += period.years;
      }

      for(var i = 0; i < period.years; ++i) {
          // this is an estimate - currently assumes all savings added at end of the year in one lump some
          runningPortfolioValue += period.annualIncome - period.annualSpending + runningPortfolioValue * annualReturnRate;
          results.annualBalances.push(runningPortfolioValue);
      }
    });

    let remainingYearsUntilRetirement = getYearsUntilRetirement(
      runningPortfolioValue, lastPeriod.annualIncome, lastPeriod.annualSpending,
      annualReturnRate, withdrawalRate);
    results.yearsToRetirement = runningYearsToRetirement + remainingYearsUntilRetirement;

    for(var i = 0; i < remainingYearsUntilRetirement && i < 200; ++i) {
        // this is an estimate - currently assumes all savings added at end of the year in one lump some
        runningPortfolioValue += lastPeriod.annualIncome - lastPeriod.annualSpending + runningPortfolioValue * annualReturnRate;
        results.annualBalances.push(runningPortfolioValue);
    }

    return results;
}

function getYearsUntilRetirement(
  initialPortfolioValue, currentAnnualIncome, currentAnnualExpenses,
  annualReturnRate, withdrawalRate
) {
  // math ported from https://networthify.com/calculator/earlyretirement
  var numerator;
  var savingsRate = (currentAnnualIncome - currentAnnualExpenses) / currentAnnualIncome;
  if (currentAnnualIncome != 0 && initialPortfolioValue != 0) {
      numerator = Math.log(
        (
          ((annualReturnRate * (1 - savingsRate) * currentAnnualIncome) / withdrawalRate) +
          (savingsRate * currentAnnualIncome)
        ) / ((annualReturnRate * initialPortfolioValue) + (savingsRate * currentAnnualIncome))
      );
  } else {
      numerator = Math.log((1 - savingsRate) * (1 / withdrawalRate) * (annualReturnRate / savingsRate) + 1);
  }
  var denominator = Math.log(1 + annualReturnRate);
  return numerator / denominator;
}
