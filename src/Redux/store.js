// store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import navbarReducer from './navbarSlice';
import userReducer from './userSlice';
import lang from "./lang"
import maintenanceReducer from "./maintenanceSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    navbar: navbarReducer,
    user: userReducer,
    lang,
    maintenance: maintenanceReducer,
});


const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,

        }),
});

export const persistor = persistStore(store);

export default store;
