import reducers from '../lib/reducers/index.js';
import {
  addPeriod, deletePeriod, editPeriod, movePeriod, setAnnualReturn, setWithdrawalRate,
  setInitialPortfolio, reset
} from '../lib/reducers/index.js';
import {createStore} from 'redux';
import chai, {expect} from 'chai';
chai.should();

describe('Store actions', () => {

  let store;

  describe('income periods', () => {

    beforeEach(()=>{
      store = createStore(reducers, {});
    });

    // TODO: refactor addPeriod to take options object
    it('should add income period', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(2, 2.2, 0));
      store.dispatch(addPeriod(3, 3.3, 1));
      store.dispatch(addPeriod(4, 4.4, 6));

      store.getState().scenario.incomePeriods.should.deep.equal([
        {income: 2, expenses: 2.2},
        {income: 3, expenses: 3.3},
        ,,,,
        {income: 4, expenses: 4.4}
      ]);
    });

    it('should add period and default to preceeding period\'s values', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(undefined, undefined, 2));

      store.getState().scenario.incomePeriods.should.deep.equal([
        {income: 1, expenses: 1.1},
        ,
        {income: 1, expenses: 1.1}
      ]);
    });

    it('should delete income period', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(2, 2.2, 1));
      store.dispatch(addPeriod(3, 3.3, 2));
      let [period1, period2, period3] = store.getState().scenario.incomePeriods;

      store.dispatch(deletePeriod(period2));

      store.getState().scenario.incomePeriods.should.deep.equal(
        [period1, , period3]);
    });

    it('should not leave holes at the end of incomePeriods array when deleting', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(3, 3.3, 3));
      let [period1,,,period4] = store.getState().scenario.incomePeriods;

      store.dispatch(deletePeriod(period4));

      store.getState().scenario.incomePeriods.should.
        deep.equal([period1]).
        and.to.have.property('length', 1);
    })

    it('should not allow deleting income period at index 0', () => {
      store.dispatch(addPeriod(10000, 9999, 0));
      let [period1] = store.getState().scenario.incomePeriods;
      expect(() => store.dispatch(deletePeriod(period1))).to.throw(Error);
    });

    it('should update income period', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(2, 2.2, 1));
      let [period1, period2] = store.getState().scenario.incomePeriods;

      store.dispatch(editPeriod(period1, {income: 888}));
      store.dispatch(editPeriod(period2, {expenses: 999}));

      store.getState().scenario.incomePeriods.should.deep.equal([
        {income:888, expenses: 1.1},
        {income: 2, expenses: 999}
      ]);
    });

    it('should move income period', () => {
        store.dispatch(addPeriod(1, 1.1, 0));
        store.dispatch(addPeriod(2, 2.2, 1));
        let [period1, period2] = store.getState().scenario.incomePeriods;

        store.dispatch(movePeriod(period2, 5));

        store.getState().scenario.incomePeriods.should.deep.equal(
          [period1,,,,,period2]);
    });

    it('Should not allow moving index period at index 0', () => {
      store.dispatch(addPeriod(10000, 9999, 0));
      let [period1] = store.getState().scenario.incomePeriods;

      expect(
        ()=>store.dispatch(movePeriod(period1, 5))
      ).to.throw(Error);
    });

    it('Should not allow moving a period that is not in incomePeriods', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(2, 2.2, 1));
      let [,period2] = store.getState().scenario.incomePeriods;
      store.dispatch(deletePeriod(period2));

      expect(()=>store.dispatch(movePeriod({income: 1, expenses: 2}, 1))
        ).to.throw(Error);
      expect(()=>store.dispatch(movePeriod(period2, 5))
        ).to.throw(Error);
    });

    it('Should trim holes from end of incomePeriods array after moving', () => {
      store.dispatch(addPeriod(1, 1.1, 0));
      store.dispatch(addPeriod(2, 2.2, 5));
      let [period1,,,,,period2] = store.getState().scenario.incomePeriods;

      store.dispatch(movePeriod(period2, 1));

      store.getState().scenario.incomePeriods.should.
        deep.equal([period1, period2]).
        and.to.have.property('length', 2);
    });

  });

  describe('simple scenario properties', () => {
    it('Should set annual return', () => {
      store.dispatch(setAnnualReturn(1234));
      store.getState().scenario.annualReturn.should.equal(1234);

      store.dispatch(setAnnualReturn(888));
      store.getState().scenario.annualReturn.should.equal(888);
    });

    it('Should set withdrawal rate', () => {
      store.dispatch(setWithdrawalRate(345));
      store.getState().scenario.withdrawalRate.should.equal(345);

      store.dispatch(setWithdrawalRate(77));
      store.getState().scenario.withdrawalRate.should.equal(77);
    });

    it('Should set initial portfolio value', () => {
      store.dispatch(setInitialPortfolio(444));
      store.getState().scenario.initialPortfolio.should.equal(444);

      store.dispatch(setInitialPortfolio(989));
      store.getState().scenario.initialPortfolio.should.equal(989);
    });
  });

  describe('reset', () => {
    it('Should reset state', () => {
      store.dispatch(setInitialPortfolio(444));
      store.dispatch(setWithdrawalRate(345));
      store.dispatch(setAnnualReturn(888));
      store.dispatch(addPeriod(2, 2.2, 5));

      store.dispatch(reset());

      store.getState().scenario.should.deep.equal({
        withdrawalRate: .04,
        annualReturn: .05,
        initialPortfolio: null,
        incomePeriods: [{income: null, expenses: null}]
      });
    });
  });
});
