export const toggleViewExpanded = () => ({ type: 'toggleViewExpanded' });
export const toggleMarketAssumptions = () => ({ type: 'toggleMarketAssumptions' });
export const showEditPeriod = ({yearIndex, propName='income'}) => ({
  type: 'showEditPeriod', yearIndex, propName
});
export const closeEditPeriod = () => ({type: 'closeEditPeriod'});

const defaultState = Object.freeze({
  expanded: true,
  editingMarketAssumptions: false,
  editingPeriod: null
});

export default function (state = defaultState, action) {
  switch(action.type) {
    case 'toggleViewExpanded':
      return Object.freeze({
        ...state,
        expanded: !state.expanded
      });
    case 'toggleMarketAssumptions':
      return Object.freeze({
        ...state,
        editingPeriod: null,
        editingMarketAssumptions: !state.editingMarketAssumptions
      });
    case 'showEditPeriod':
      return Object.freeze({
        ...state,
        editingMarketAssumptions: false,
        editingPeriod: {yearIndex: action.yearIndex, propName: action.propName}
      });
    case 'closeEditPeriod':
      return Object.freeze({
        ...state,
        editingPeriod: false
      });
    default:
      return state;
  }
}
