import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";

import messageSliceReducer from "@/store/message";
import { IReduxStore } from "@/interface/redux";
import { useDispatch } from "react-redux";

export const makeStore = () => {
  return configureStore<IReduxStore>({
    reducer: {
      message: messageSliceReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch: () => AppDispatch = useDispatch;

export const wrapper = createWrapper<AppStore>(makeStore);
