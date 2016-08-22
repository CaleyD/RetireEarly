import { combineReducers } from 'redux';
import scenario from './scenario.js';
import ui from './ui.js';
import storage from './storage.js';

export default combineReducers({ scenario, ui, storage });
