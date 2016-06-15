// scenario: {initialPortfolioValue: NUMBER, annualReturnRate: NUMBER, withdrawalRate: NUMBER, incomePeriods: ARRAY[{annualIncome: NUMBER, annualSpending: NUMBER}]}
module.exports.calculate = function(scenario) {
    if(
      typeof scenario.initialPortfolioValue !== 'number' ||
      typeof scenario.annualReturn !== 'number' ||
      typeof scenario.withdrawalRate !== 'number' ||
      !Array.isArray(scenario.incomePeriods) ||
      scenario.incomePeriods.length === 0
    ) {
      throw new Error('invalid scenario object!');
    }
    // return array of savings for each year until FI
    // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}


    var currentAnnualIncome = scenario.incomePeriods[0].annualIncome;
    var currentAnnualExpenses = scenario.incomePeriods[0].annualSpending;
    var withdrawalRate = scenario.withdrawalRate;
    var annualReturnRate = scenario.annualReturn;
    var initialPortfolioValue = scenario.initialPortfolioValue;

    var results = {
      retirementPortfolioValue: currentAnnualExpenses / withdrawalRate,
      yearsToRetirement: null,
      annualBalances: []
    };

    //
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
    results.yearsToRetirement = numerator / denominator;

    var runningPortfolioValue = initialPortfolioValue;
    for(var i = 0; i < results.yearsToRetirement && i < 200; ++i) {
        // this is an estimate - currently assumes all savings added at end of the year in one lump some
        runningPortfolioValue += currentAnnualIncome - currentAnnualExpenses + runningPortfolioValue * annualReturnRate;
        results.annualBalances.push(runningPortfolioValue);
    }

    return results;
}
