export const toggleViewExpanded = () => ({ type: 'toggleViewExpanded' });

const defaultState = Object.freeze({expanded: true});

export default function (state = defaultState, action) {
  if(action.type === 'toggleViewExpanded') {
    return { expanded: !state.expanded };
  }
  return state;
};
