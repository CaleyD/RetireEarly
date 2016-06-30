import { AsyncStorage } from 'react-native';
var update = require('react-addons-update');
var EventEmitter = require('EventEmitter');
const key = 'scenario';
var scenario;

function getDefaultScenario() {
  return {
    initialPortfolioValue: 100000,
    annualReturn: .05,
    withdrawalRate: .04,
    incomePeriods: [{
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
  removeIncomePeriod(incomePeriod) {
    this._update({
      incomePeriods: {
        $splice: [[scenario.incomePeriods.indexOf(incomePeriod), 1]]
      }
    });
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
  insertIncomePeriod(atYearIndex, newIncomePeriod) {
    var incomePeriods = scenario.incomePeriods;

    var previousIncomePeriod = getIncomePeriodForYearIndex(atYearIndex);
    // set new income period years
    if(previousIncomePeriod.years == null) {
      newIncomePeriod.years = null;
    } else {
      newIncomePeriod.years = previousIncomePeriod.years + previousIncomePeriod.startYearIndex - atYearIndex;
    }
    // update years of previous income period
    var updatedPreviousIncomePeriodYears = atYearIndex - previousIncomePeriod.startYearIndex;

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

    function getIncomePeriodForYearIndex(yearIndex) {
      var currYearIndex = 0;
      for(var i=0; i<incomePeriods.length; ++i) {
        let period = incomePeriods[i];
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
  }
  setInitialPortfolioValue(initialPortfolioValue) {
    this._setProperty('initialPortfolioValue', initialPortfolioValue);
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
    var command = {};
    command[propName] = { $set: num };
    this._update(command);
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
