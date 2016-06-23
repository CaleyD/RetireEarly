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
  appendIncomePeriod(yearsAfterLastPeriod, incomePeriod) {
    var incomePeriods = scenario.incomePeriods;
    var latestPeriod = incomePeriods[incomePeriods.length-1];

    this._update({
      incomePeriods: {$splice: [[incomePeriods.length-1, 1,
        {
          annualIncome: latestPeriod.annualIncome,
          annualSpending: latestPeriod.annualSpending,
          years: yearsAfterLastPeriod
        },
        incomePeriod]]
      }
    });
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
