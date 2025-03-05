import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: number;
  description: string;
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
export const fetchStockData = createAsyncThunk("stock/fetchData", async () => {
  const response = await fetch(
    "https://script.google.com/macros/s/AKfycbyE3x3exGpNQaIADJ8L8Vu6X9OyoHiU3uhGTgTKuKVsNT-X-C68JyiWsmkAj7ffqTT1/exec"
  );
  const data = await response.json();

  if (Array.isArray(data)) {
    return data.map(transformStockData);
  } else {
    throw new Error("Invalid API response format");
  }
});

// **Stock Data Slice**
const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchStockData.fulfilled,
        (state, action: PayloadAction<StockData[]>) => {
          state.isLoading = false;
          state.data = action.payload;
        }
      )
      .addCase(fetchStockData.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default stockSlice.reducer;
