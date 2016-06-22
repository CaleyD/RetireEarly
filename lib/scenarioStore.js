// naive store implementation - replace with redux
// this is a singleton
import { AsyncStorage } from 'react-native';
var update = require('react-addons-update');
var onChangeCallback;
const key = 'scenario';
var cachedScenario;

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

var scenarioStore = {
  onChange: function(callback) {
    onChangeCallback = callback;
  },
  getScenario: function(callback) {
    AsyncStorage.getItem(key, function(err, value) {
      if(err) {
        return callback ? callback(err) : undefined;
      }
      this.initialized = true;
      cachedScenario = value ? JSON.parse(value) : getDefaultScenario();
      if(callback) {
        callback(null, cachedScenario);
      }
    });
  },
  setScenario: function(scenario) {
    cachedScenario = scenario;
    AsyncStorage.setItem(key, JSON.stringify(scenario), function(err) {
      if(onChangeCallback) {
        onChangeCallback(scenario);
      }
    });
  },
  removeIncomePeriod(incomePeriod) {
    this.setScenario(update(cachedScenario, {
      incomePeriods: {
        $splice: [[cachedScenario.incomePeriods.indexOf(incomePeriod), 1]]
      }
    }));
  },
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
      var index = cachedScenario.incomePeriods.indexOf(incomePeriod);
      scenarioStore.setScenario(update(cachedScenario, {
        incomePeriods: {
          $splice: [[index, 1, newIncomePeriod]]
        }
      }));
    }
  },
  appendIncomePeriod(yearsAfterLastPeriod, incomePeriod) {
    var incomePeriods = cachedScenario.incomePeriods;
    var latestPeriod = incomePeriods[incomePeriods.length-1];

    scenarioStore.setScenario(update(cachedScenario, {
      incomePeriods: {$splice: [[incomePeriods.length-1, 1,
        {
          annualIncome: latestPeriod.annualIncome,
          annualSpending: latestPeriod.annualSpending,
          years: yearsAfterLastPeriod
        },
        incomePeriod]]
      }
    }));
  },
  setInitialPortfolioValue(initialPortfolioValue) {
    this._setProperty('initialPortfolioValue', initialPortfolioValue);
  },
  setWithdrawalRate(withdrawalRate) {
    this._setProperty('withdrawalRate', withdrawalRate);
  },
  setAnnualReturn(annualReturn) {
    this._setProperty('annualReturn', annualReturn);
  },
  _setProperty(propName, num) {
    var command = {};
    command[propName] = { $set: num };
    scenarioStore.setScenario(update(cachedScenario, command));
  },
  initialized: false
};

scenarioStore.getScenario();

module.exports = scenarioStore;
