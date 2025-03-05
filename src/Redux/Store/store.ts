import { configureStore } from "@reduxjs/toolkit";
import RetrivechatDatasreducer from "../Slice/stock";

export const store = configureStore({
  reducer: {
    NewchatData: RetrivechatDatasreducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
