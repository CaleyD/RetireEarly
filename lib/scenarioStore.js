// naive store implementation - replace with redux
// this is a singleton
import { AsyncStorage } from 'react-native';
var onChangeCallback;
const key = 'scenario';

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
      if(callback) {
        callback(null, value ? JSON.parse(value) : getDefaultScenario());
      }
    });
  },
  setScenario: function(scenario) {
    AsyncStorage.setItem(key, JSON.stringify(scenario), function(err) {
      if(onChangeCallback) {
        onChangeCallback(scenario);
      }
    });
  },
  initialized: false
};

scenarioStore.getScenario();

module.exports = scenarioStore;
