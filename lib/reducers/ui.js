export const toggleViewExpanded = () => ({ type: 'toggleViewExpanded' });
export const toggleMarketAssumptions = () => ({ type: 'toggleMarketAssumptions' });

const defaultState = Object.freeze({
  expanded: true,
  editingMarketAssumptions: false
});

export default function (state = defaultState, action) {
  switch(action.type) {
    case 'toggleViewExpanded':
      return Object.freeze({...state, expanded: !state.expanded});
    case 'toggleMarketAssumptions':
      return Object.freeze({...state, editingMarketAssumptions: !state.editingMarketAssumptions});
    default:
      return state;
  }
}
