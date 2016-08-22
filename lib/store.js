import {persistStore, autoRehydrate} from "redux-persist";
import {createStore} from "redux";
import {AsyncStorage} from "react-native";
import rootReducer from "./reducers/index.js";

const store = createStore(rootReducer, autoRehydrate());
persistStore(store, {storage: AsyncStorage});

export default store;
