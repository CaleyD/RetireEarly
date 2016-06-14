module.exports.calculate = function(
  currentAnnualIncome, currentAnnualExpenses, currentPortfolioValue, annualReturnRate, withdrawalRate) {

    // return array of savings for each year until FI
    // {annualProjections: [{endOfYear, netWorth, annualROI}], yearsUntilFI, portfolioAtFI}

    var results = {
      retirementPortfolioValue: currentAnnualExpenses / withdrawalRate,
      yearsToRetirement: null,
      annualBalances: []
    };

    //
    // math ported from https://networthify.com/calculator/earlyretirement
    var numerator;
    var savingsRate = (currentAnnualIncome - currentAnnualExpenses) / currentAnnualIncome;
    if (currentAnnualIncome != 0 && currentPortfolioValue != 0) {
        numerator = Math.log((((annualReturnRate * (1 - savingsRate) * currentAnnualIncome) / withdrawalRate) + (savingsRate * currentAnnualIncome)) / ((annualReturnRate * currentPortfolioValue) + (savingsRate * currentAnnualIncome)));
    } else {
        numerator = Math.log((1 - savingsRate) * (1 / withdrawalRate) * (annualReturnRate / savingsRate) + 1);
    }
    var denominator = Math.log(1 + annualReturnRate);
    results.yearsToRetirement = numerator / denominator;

    var runningPortfolioValue = currentPortfolioValue;
    for(var i = 0; i < results.yearsToRetirement && i < 200; ++i) {
        // this is an estimate - currently assumes all savings added at end of the year in one lump some
        runningPortfolioValue += currentAnnualIncome - currentAnnualExpenses + runningPortfolioValue * annualReturnRate;
        results.annualBalances.push(runningPortfolioValue);
    }

    return results;
}
