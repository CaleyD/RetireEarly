import { AsyncStorage } from 'react-native';
var update = require('react-addons-update');
var EventEmitter = require('EventEmitter');
const key = 'scenario';
var scenario;

function getDefaultScenario() {
  return {
    initialPortfolio: 100000,
    annualReturn: .05,
    withdrawalRate: .04,
    incomePeriods: [{
      annualIncome: 100000,
      annualSpending: 45000,
      years: 5
    },{
      annualIncome: 100000,
      annualSpending: 45000
    }]
  };
}

class ScenarioStore extends EventEmitter {
  constructor() {
    super();
    scenario = null;
  }
  getScenario(callback) {
    if(scenario) {
      return setImmediate(()=>callback(null, scenario));
    }
    AsyncStorage.getItem(key, function(err, value) {
      if(err) {
        return callback(err);
      }
      scenario = value ? JSON.parse(value) : getDefaultScenario();
      if(callback) {
        callback(null, scenario);
      }
    });
  }
  moveIncomPeriodToYearIndex(incomePeriod, newYearIndex) {
    this.removeIncomePeriod(incomePeriod);
    this.insertIncomePeriod(newYearIndex, incomePeriod.annualIncome, incomePeriod.annualSpending);
  }
  removeIncomePeriod(incomePeriod) {
    var index = scenario.incomePeriods.indexOf(incomePeriod);
    if(index === 0) {
      throw new Error('cannot delete first income period!');
    }
    this._update({
      incomePeriods: { $splice: [[index, 1]] }
    });
    if(index === scenario.incomePeriods.length) {
      this.updateIncomePeriod(scenario.incomePeriods[index-1], {years: null});
    }
  }
  updateIncomePeriod(incomePeriod, newPropertyValues) {
    var didUpdate = false;
    var newIncomePeriod = JSON.parse(JSON.stringify(incomePeriod));
    Object.keys(newPropertyValues).forEach((key) => {
      if(incomePeriod[key] != newPropertyValues[key]) {
        didUpdate = true;
        newIncomePeriod[key] = newPropertyValues[key];
      }
    });
    if(didUpdate) {
      var index = scenario.incomePeriods.indexOf(incomePeriod);
      this._update({
        incomePeriods: {
          $splice: [[index, 1, newIncomePeriod]]
        }
      });
    }
  }
  insertIncomePeriod(atYearIndex, annualIncome, annualSpending) {
    var newIncomePeriod = {};
    var incomePeriods = scenario.incomePeriods;

    var previousIncomePeriod = this._getIncomePeriodForYearIndex(atYearIndex);
    // set new income period years
    if(previousIncomePeriod.years == null) {
      newIncomePeriod.years = null;
    } else {
      newIncomePeriod.years = previousIncomePeriod.years + previousIncomePeriod.startYearIndex - atYearIndex;
    }
    // update years of previous income period
    var updatedPreviousIncomePeriodYears = atYearIndex - previousIncomePeriod.startYearIndex;

    newIncomePeriod.annualSpending = annualSpending || previousIncomePeriod.annualSpending;
    newIncomePeriod.annualIncome = annualIncome || previousIncomePeriod.annualIncome;

    if(updatedPreviousIncomePeriodYears === 0) {
      // delete the old period and overwrite with this one
      this._update({
        incomePeriods: {$splice: [[previousIncomePeriod.indexInIncomePeriods, 1,
          newIncomePeriod]]
        }
      });
    } else {
      this._update({
        incomePeriods: {$splice: [[previousIncomePeriod.indexInIncomePeriods, 1,
          {
            annualIncome: previousIncomePeriod.annualIncome,
            annualSpending: previousIncomePeriod.annualSpending,
            years: updatedPreviousIncomePeriodYears
          },
          newIncomePeriod]]
        }
      });
    }
  }
  _getIncomePeriodForYearIndex(yearIndex) {
    var currYearIndex = 0;
    for(var i=0; i<scenario.incomePeriods.length; ++i) {
      let period = scenario.incomePeriods[i];
      if(period.years == null ||
        currYearIndex === yearIndex ||
        currYearIndex + period.years > yearIndex
      ) {
        return {
          annualIncome: period.annualIncome,
          annualSpending: period.annualSpending,
          startYearIndex: currYearIndex,
          indexInIncomePeriods: i
        };
      }
      currYearIndex += period.years;
    }
    return null;
  }
  setInitialPortfolioValue(initialPortfolio) {
    this._setProperty('initialPortfolio', initialPortfolio);
  }
  setWithdrawalRate(withdrawalRate) {
    this._setProperty('withdrawalRate', withdrawalRate);
  }
  setAnnualReturn(annualReturn) {
    this._setProperty('annualReturn', annualReturn);
  }
  resetScenario() {
    this._setScenario(getDefaultScenario());
  }
  _setProperty(propName, num) {
    this._update({[propName]: {$set: num}});
  }
  _update(command) {
    this._setScenario(update(scenario, command));
  }
  _setScenario(value) {
    scenario = value;
    AsyncStorage.setItem(key, JSON.stringify(scenario), (err) => {
      this.emit('change', scenario);
    });
  }
}

module.exports = new ScenarioStore();
