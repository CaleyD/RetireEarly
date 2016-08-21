const update = require('react-addons-update');

export const toggleViewExpanded = () => ({ type: 'toggleViewExpanded' });
export const toggleMarketAssumptions = () => ({ type: 'toggleMarketAssumptions' });

const defaultState = Object.freeze({
  expanded: true,
  editingMarketAssumptions: false
});

function toggleProp(state, prop) {
  return Object.freeze(update(state, {[prop]: { $set: !state[prop] }}));
}

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
