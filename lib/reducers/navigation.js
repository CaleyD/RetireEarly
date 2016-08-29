// *** Action Types ***
const NAVIGATE = 'NAVIGATE';
const NAV_PUSH = 'NAV_PUSH';
const NAV_POP = 'NAV_POP';
const NAV_JUMP_TO_KEY = 'NAV_JUMP_TO_KEY';
const NAV_JUMP_TO_INDEX = 'NAV_JUMP_TO_INDEX';
const NAV_RESET = 'NAV_RESET';


// *** Action Creators ***
// The following action creators were derived from NavigationStackReducer
export function navigatePush (state) {
	state = typeof state === 'string' ? { key: state, title: state } : state;
	return {
		type: NAV_PUSH,
		state
	};
}

export function navigatePop () {
	return { type: NAV_POP };
}

export function navigateJumpToKey (key) {
	return {
		type: NAV_JUMP_TO_KEY,
		key
	};
}

export function navigateJumpToIndex (index) {
	return {
		type: NAV_JUMP_TO_INDEX,
		index
	};
}

export function navigateReset (routes, index) {
	return {
		type: NAV_RESET,
		index,
		routes
	};
}
import * as NavigationStateUtils from 'NavigationStateUtils';

const initialNavState = {
	index: 0,
	routes: [
		{ key: 'Intro', title: 'Intro', hideHeader: true }
	]
};

function navigationState (state = initialNavState, action) {
	switch (action.type) {
		case NAV_PUSH:
			if (
        state.routes[state.index].key === (action.state && action.state.key)
      ) {
        return state;
      }
			return NavigationStateUtils.push(state, action.state);

		case NAV_POP:
			if (state.index === 0 || state.routes.length === 1) return state;
			return NavigationStateUtils.pop(state);

		case NAV_JUMP_TO_KEY:
			return NavigationStateUtils.jumpTo(state, action.key);

		case NAV_JUMP_TO_INDEX:
			return NavigationStateUtils.jumpToIndex(state, action.index);

		case NAV_RESET:
			return {
				...state,
				index: action.index,
				routes: action.routes
			};

		default:
			return state;
	}
}

export default navigationState;