import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GetStockStatus } from "../../api/api";

interface StockData {
  Price: number;
  Quantity: number;
  StockID: string;
  Category: string;
  Email: string;
}

interface StockState {
  isLoading: boolean;
  isError: boolean;
  data: StockData[];
}

// Initial state
const initialState: StockState = {
  isLoading: false,
  isError: false,
  data: [],
};

function transformStockData(apiData: any) {
  return {
    symbol: apiData.Code_act,
    name: apiData.Company_Name,
    price: Number(apiData.LTP) || 0,
    change: Number(apiData.change) || 0,
    percentChange:
      typeof apiData.Change_percent === "string"
        ? Number(apiData.Change_percent.replace("%", "")) || 0
        : Number(apiData.Change_percent) || 0, // Handle case where it's already a number
    volume:
      typeof apiData.Volume === "string"
        ? Number(apiData.Volume.replace(/[^\d.]/g, "")) || 0
        : Number(apiData.Volume) || 0,
    marketCap:
      typeof apiData.Marketcap === "string"
        ? Number(apiData.Marketcap.replace(/[^\d.]/g, "")) || 0
        : Number(apiData.Marketcap) || 0,
    description: `${apiData.Company_Name} operates in various sectors and is one of India's largest conglomerates.`,
  };
}

// **Fetch Stock Data Thunk**
export const fetchBuyandSellStockData = createAsyncThunk<StockData[], string>(
  "stock/fetchStockData",
  async (email, { rejectWithValue }) => {
    try {
      const mail = localStorage.getItem("mail");
      const response = await GetStockStatus(mail || "");
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// **Stock Data Slice**
const BUYandSellstockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuyandSellStockData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchBuyandSellStockData.fulfilled,
        (state, action: PayloadAction<StockData[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchBuyandSellStockData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default BUYandSellstockSlice.reducer;
