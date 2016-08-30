import {persistStore, autoRehydrate} from "redux-persist";
import {createStore} from "redux";
import {AsyncStorage} from "react-native";
import rootReducer from "./reducers/index.js";
// TODO: use in dev - https://github.com/leoasis/redux-immutable-state-invariant
const store = createStore(rootReducer, autoRehydrate());
persistStore(store, {storage: AsyncStorage});

export default store;
