import { configureStore } from "@reduxjs/toolkit";
import RetrivechatDatasreducer from "../Slice/stock";
import BUYandSellstockSlicereducer from "../Slice/BuyandSell";
export const store = configureStore({
  reducer: {
    NewchatData: RetrivechatDatasreducer,
    BuyandSell: BUYandSellstockSlicereducer,
  },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
