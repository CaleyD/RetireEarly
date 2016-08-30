export const toggleViewExpanded = () => ({
  type: 'toggleViewExpanded'
});
export const toggleMarketAssumptions = () => ({
  type: 'toggleMarketAssumptions'
});

const defaultState = {
  expanded: true,
  editingMarketAssumptions: false
};

export default function (state = defaultState, action) {
  switch (action.type) {
    case 'toggleViewExpanded':
      return { ...state, expanded: !state.expanded };
    case 'toggleMarketAssumptions':
      return {
        ...state,
        editingPeriod: null,
        editingMarketAssumptions: !state.editingMarketAssumptions
      };
    default:
      return state;
  }
}
