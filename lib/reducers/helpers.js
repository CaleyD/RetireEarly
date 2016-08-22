const update = require('react-addons-update');

export const setProp = (state, prop, value) => {
  return Object.freeze(update(state, {[prop]: { $set: value }}));
};

export const toggleProp = (state, prop) => {
  return setProp(state, prop, !state[prop]);
};

export const updateProp = (state, prop, value) => {
  return (state[prop] === value) ?
    state :
    Object.freeze(update(state, { [prop]: { $set: Object.freeze(value) }}));
};
