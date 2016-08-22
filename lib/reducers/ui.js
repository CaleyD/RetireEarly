import { toggleProp } from './helpers.js';

export const toggleViewExpanded = () => ({ type: 'toggleViewExpanded' });
export const toggleMarketAssumptions = () => ({ type: 'toggleMarketAssumptions' });

const defaultState = Object.freeze({
  expanded: true,
  editingMarketAssumptions: false
});

export default function (state = defaultState, action) {
  switch(action.type) {
    case 'toggleViewExpanded':
      return toggleProp(state, 'expanded');
    case 'toggleMarketAssumptions':
      return toggleProp(state, 'editingMarketAssumptions');
    default:
      return state;
  }
};
