import { REHYDRATE } from 'redux-persist/constants'

export default function storage(state = {}, {type}) {
  return (type === REHYDRATE) ? { storageLoaded: true } : state;
}
