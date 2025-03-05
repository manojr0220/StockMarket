import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import StockCard from "./stock-card";
import StockDetail from "./stock-details";
import "./RecomendedScreen.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { fetchStockData } from "../../Redux/Slice/stock";
import Button from "../../UIkit/Button/Button";
import NavBar from "../navbar/Navbar";
import SvgSpinner from "../../Icon/SvgSpinner";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  marketCap: number;
  description: string;
}
export default function StockDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeTab, setActiveTab] = useState("gainers");

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchStockData());

    const interval = setInterval(() => {
      dispatch(fetchStockData());
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  const {
    data: stockData,
    isLoading,
    isError,
  } = useSelector((state: RootState) => state.NewchatData); 
  const topGainers = stockData
    ?.filter((stock: Stock) => stock.percentChange > 0)
    ?.sort((a: Stock, b: Stock) => b.percentChange - a.percentChange)
    ?.slice(0, 12);

  const topLosers = [...stockData]
    ?.filter((stock: Stock) => stock.percentChange < 0)
    ?.sort((a: Stock, b: Stock) => a.percentChange - b.percentChange)
    ?.slice(0, 12);

  // Filter stocks based on search query
  const searchResults = searchQuery
    ? stockData.filter(
        (stock: Stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <>
      <NavBar />
      {stockData.length === 0 ? (
        <div className="loader" style={{ width: window.innerWidth }}>
          <SvgSpinner width={62} height={62} />
        </div>
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1>Stock Recommendations</h1>
            <p>Top performing and declining stocks for today</p>
          </div>

          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search for a stock by name..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {searchQuery && searchResults.length > 0 ? (
            <div className="search-results">
              <h2>Search Results</h2>
              <div className="stock-grid">
                {searchResults.map((stock: any) => (
                  <StockCard
                    key={stock.symbol}
                    stock={stock}
                    onClick={() => handleStockSelect(stock)}
                  />
                ))}
              </div>
            </div>
          ) : searchQuery ? (
            <div className="no-results">
              <p>No stocks found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="tabs-container">
              <div className="tabs-header">
                <Button
                  width={150}
                  disabled={activeTab === "gainers"}
                  labelName={" Top Gainers"}
                  onClick={() => setActiveTab("gainers")}
                ></Button>
                <Button
                  width={150}
                  disabled={activeTab !== "gainers"}
                  labelName={"Top Losers"}
                  onClick={() => setActiveTab("losers")}
                ></Button>
              </div>
              <div className="tab-content">
                {activeTab === "gainers" ? (
                  <div className="stock-grid">
                    {topGainers.map((stock: any) => (
                      <StockCard
                        key={stock.symbol}
                        stock={stock}
                        onClick={() => handleStockSelect(stock)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="stock-grid">
                    {topLosers.map((stock) => (
                      <StockCard
                        key={stock.symbol}
                        stock={stock}
                        onClick={() => handleStockSelect(stock)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedStock && (
            <div className="stock-detail-card">
              <div className="stock-detail-header">
                <h2>Stock Details</h2>
                <p>Detailed information for {selectedStock.symbol}</p>
              </div>
              <div className="stock-detail-content">
                <StockDetail stock={selectedStock} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
