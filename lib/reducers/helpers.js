export const updateProp = (state, prop, value) => {
  return state[prop] === value ? state : { ...state, [prop]: value };
};
