import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import chatSlice from "./features/chatSlice";

const saveUserOnlyFilter = createFilter("user", ["user"]);

//persist config
const persistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["user"],
  transforms: [saveUserOnlyFilter],
};

const rootReducer = combineReducers({
  user: userSlice,
  chat: chatSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export const persistor = persistStore(store);
