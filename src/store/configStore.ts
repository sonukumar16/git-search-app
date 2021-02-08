import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';


import rootReducer from './reducers';
import initialState from "./reducers/initialState"

const persistConfig = {
  key: 'root',
  storage,
  
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer,initialState, applyMiddleware(thunk))
  let persistor = persistStore(store)
  return { store, persistor }
}
