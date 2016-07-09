import { combineReducers } from 'redux';
const calc = require('../calculator.js').calculate;
let update = require('react-addons-update');

const DELETE_PERIOD = 'DELETE_PERIOD';
const ADD_PERIOD = 'ADD_PERIOD';
const EDIT_PERIOD = 'EDIT_PERIOD';
const MOVE_PERIOD = 'MOVE_PERIOD';
const RESET = 'RESET';
const UPDATE_WITHDRAWALRATE = 'UPDATE_WITHDRAWALRATE';
const UPDATE_ANNUALRETURN = 'UPDATE_ANNUALRETURN';
const UPDATE_INITIALPORTFOLIO = 'UPDATE_INITIALPORTFOLIO';

export const deletePeriod = period => ({ type: DELETE_PERIOD, period });
export const addPeriod = (income, expenses, yearIndex) => ({ type: ADD_PERIOD, income, expenses, yearIndex });
export const editPeriod = (period, props) => ({ type: EDIT_PERIOD, period, props});
export const movePeriod = (period, yearIndex) => ({ type: MOVE_PERIOD, period, yearIndex });
export const reset = () => ({type: RESET});
export const setAnnualReturn = (num) => ({ type: UPDATE_ANNUALRETURN, value: num});
export const setWithdrawalRate = (num) => ({ type: UPDATE_WITHDRAWALRATE, value: num});
export const setInitialPortfolio = (num) => ({ type: UPDATE_INITIALPORTFOLIO, value: num});

const emptyScenario = Object.freeze({
  withdrawalRate: null,
  annualReturn: null,
  initialPortfolio: null,
  incomePeriods: [{income: null, expenses: null}]
});

const reducers = {
  [RESET]: () => emptyScenario,
  [UPDATE_ANNUALRETURN] : (state, {value}) =>
    updateProp(state, 'annualReturn', value),
  [UPDATE_WITHDRAWALRATE]: (state, {value}) =>
    updateProp(state, 'withdrawalRate', value),
  [UPDATE_INITIALPORTFOLIO]: (state, {value}) =>
    updateProp(state, 'initialPortfolio', value),
  [ADD_PERIOD]: (state, {yearIndex, income, expenses}) => {
    let incomePeriods = state.incomePeriods.slice(0);
    incomePeriods[yearIndex] = Object.freeze({income, expenses});
    return updateProp(state, 'incomePeriods', incomePeriods);
  },
  [EDIT_PERIOD]: (state, {period, props: {income, expenses}}) => {
    let incomePeriods = state.incomePeriods.slice(0);
    let newPeriod = Object.assign({}, period);
    if(typeof income === 'number') {
      newPeriod.income = income;
    }
    if(typeof expenses === 'number') {
      newPeriod.expenses = expenses;
    }
    incomePeriods[incomePeriods.indexOf(period)] = Object.freeze(newPeriod);
    return updateProp(state, 'incomePeriods', incomePeriods);
  },
  [DELETE_PERIOD]: (state, {period}) => {
    let incomePeriods = state.incomePeriods.slice(0);
    let index = state.incomePeriods.indexOf(period);
    if(index === 0) {
      throw new Error('cannot delete first income period!');
    }
    delete incomePeriods[index];
    return updateProp(state, 'incomePeriods', trimTrailingHoles(incomePeriods));
  },
  [MOVE_PERIOD]: (state, {period, yearIndex}) => {
    let incomePeriods = state.incomePeriods.slice(0);
    let index = state.incomePeriods.indexOf(period);
    if(index === 0) {
      throw new Error('cannot move first income period!');
    }
    if(index === -1) {
      throw new Error('invalid period!');
    }
    delete incomePeriods[index];
    incomePeriods[yearIndex] = period;
    return updateProp(state, 'incomePeriods', trimTrailingHoles(incomePeriods));
  }
};

const updateProp = (state, prop, value) => {
  return Object.freeze(update(state, { [prop]: { $set: Object.freeze(value) }}));
}

const trimTrailingHoles = (array) => {
  while(!array[array.length -1]) {
    array.length = array.length - 1;
  }
  return array;
}

const scenario = (state = emptyScenario, action) => {
  if(reducers[action.type]) {
    return reducers[action.type](state, action);
  }
  return state;
};

const reducer = combineReducers({ scenario });

export default reducer;
