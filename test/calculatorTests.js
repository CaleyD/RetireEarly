import chai, { expect } from 'chai';
chai.should();
import { calculate } from '../lib/calculator.js';

describe('Calculator', () => {
  it('should return error object if scenario is incomplete', () => {
    calculate({
      annualReturn: 1,
      initialPortfolio: 1,
      withdrawalRate: 1,
      incomePeriods: [{income: 1, expenses: null}]
    }).should.have.property('error', true);

    calculate({
      annualReturn: 1,
      initialPortfolio: 1,
      withdrawalRate: 1,
      incomePeriods: [{income: null, expenses: 1}]
    }).should.have.property('error', true);

    calculate({
      annualReturn: 1,
      initialPortfolio: 1,
      withdrawalRate: null,
      incomePeriods: [{income: 1, expenses: 1}]
    }).should.have.property('error', true);

    calculate({
      annualReturn: 1,
      initialPortfolio: null,
      withdrawalRate: 1,
      incomePeriods: [{income: 1, expenses: 1}]
    }).should.have.property('error', true);

    calculate({
      annualReturn: null,
      initialPortfolio: 1,
      withdrawalRate: 1,
      incomePeriods: [{income: 1, expenses: 1}]
    }).should.have.property('error', true);
  });

  it('should calculate years to retirement for single income period', () => {
    let results = calculate({
      annualReturn: .05,
      initialPortfolio: 50000,
      withdrawalRate: .04,
      incomePeriods: [{income: 100000, expenses: 20000}]
    });

    results.should.have.property('yearsToRetirement', 4.9);
    results.annualBalances.
      map(({balance}) => balance).
      slice(0, 5).
      should.deep.equal([
        132500,
        219125,
        310081,
        405585,
        505865
      ]);
  });

  if ('should calculate retirement portfolio value based on withdrawal rate and final income period', () => {
    calculate({
      annualReturn: .05, initialPortfolio: 50000,
      withdrawalRate: .04,
      incomePeriods: [
        {income: 100000, expenses: 12345}
      ]
    }).retirementPortfolio.should.equal(4.9);

    calculate({
      annualReturn: .05, initialPortfolio: 50000,
      withdrawalRate: .03,
      incomePeriods: [
        {income: 100000, expenses: 12345},
        {income: 100000, expenses: 40000},
        ,,,
        {income: 100000, expenses: 35000}
      ]
    }).retirementPortfolio.should.equal(35000/.03);
  });

  it('should calculate years to retirement for single income period', () => {
    let results = calculate({
      annualReturn: .05,
      initialPortfolio: 200000,
      withdrawalRate: .04,
      incomePeriods: [
        {income: 100000, expenses: 24000}
      ]
    });

    results.should.have.property('yearsToRetirement', 4.3);
    results.annualBalances.
      map(({ balance }) => balance).
      slice(0, 5).
      should.deep.equal([
        286000,
        376300,
        471115,
        570671,
        675204
      ]);
  });

  it('should calculate years to retirement for multiple income periods', () => {
    let results = calculate({
      annualReturn: .05,
      initialPortfolio: 0,
      withdrawalRate: .04,
      incomePeriods: [
        {income: 100000, expenses: 100000},
        ,,, // holes represent years with the previous income/expenses
        {income: 150000, expenses: 40000}
      ]
    }).should.have.property('yearsToRetirement', 11.7);
  });
});
