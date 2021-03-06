export const updateProp = (state, prop, value) => {
  return (state[prop] === value) ?
    state :
    Object.freeze({
      ...state,
      [prop]: (typeof value === 'object') ? Object.freeze(value) : value
    });
};
