import { combineReducers } from 'redux';
import scenarioReducer from './scenario.js';
import uiReducer from './ui.js';

export default combineReducers({
  scenario: scenarioReducer,
  viewDetails: uiReducer
});
