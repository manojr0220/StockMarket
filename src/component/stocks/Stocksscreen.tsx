"use client";

import { useEffect, useState } from "react";
import "./Stocksscreen.css";
import NavBar from "../navbar/Navbar";
import { GetStockStatus, updateStockStatus } from "../../api/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { fetchBuyandSellStockData } from "../../Redux/Slice/BuyandSell";
import { fetchStockData } from "../../Redux/Slice/stock";
import Button from "../../UIkit/Button/Button";
import SvgSpinner from "../../Icon/SvgSpinner";

// Types
interface Stock {
  id: string;
  symbol: string;
  companyName: string;
  purchasePrice: number;
  currentPrice: number;
  quantity: number;
  purchaseDate: string;
  soldDate?: string;
  soldPrice?: number;
}

export default function StockPortfolio() {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(fetchStockData()).then(() => {
      dispatch(fetchBuyandSellStockData(""));
    });
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(fetchStockData());
    }, 60000);
    return () => clearInterval(interval);
  }, [dispatch]);
  const {
    data: stockData,
    isLoading,
    isError,
  } = useSelector((state: RootState) => state.NewchatData);
  const { BuyandSell } = useSelector((state: RootState) => {
    return {
      BuyandSell: state.BuyandSell,
    };
  });
  // Sample data - in a real app this would come from an API
  const [boughtStocks, setBoughtStocks] = useState<any>(BuyandSell);
  const [loader, setloader] = useState<any>(false);
  const [soldStocks, setSoldStocks] = useState<Stock[]>([
    {
      id: "5",
      symbol: "TSLA",
      companyName: "Tesla, Inc.",
      purchasePrice: 650.6,
      currentPrice: 750.2,
      quantity: 8,
      purchaseDate: "2023-01-05",
      soldDate: "2023-05-20",
      soldPrice: 750.2,
    },
    {
      id: "6",
      symbol: "NFLX",
      companyName: "Netflix, Inc.",
      purchasePrice: 520.75,
      currentPrice: 480.3,
      quantity: 4,
      purchaseDate: "2023-02-10",
      soldDate: "2023-06-15",
      soldPrice: 480.3,
    },
  ]);

  const [selectedStock, setSelectedStock] = useState<any>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const [activeTab, setActiveTab] = useState<"bought" | "sold">("bought");

  // Calculate profit/loss
  const calculateProfitLoss = (purchasePrice: number, currentPrice: number) => {
    return ((currentPrice - purchasePrice) / purchasePrice) * 100 || 0;
  };

  // Open sell modal
  const openSellModal = (stock: Stock) => {
    setSelectedStock(stock);
    setSellQuantity(1);
    setSellPrice(stock.currentPrice);
    setIsSellModalOpen(true);
  };

  // Close sell modal
  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSelectedStock(null);
  };

  // Handle sell stock
  const handleSellStock = () => {
    if (!selectedStock) return;

    const now = new Date().toISOString().split("T")[0];

    // Create a new sold stock entry
    const soldStock: Stock = {
      ...selectedStock,
      quantity: sellQuantity,
      soldDate: now,
      soldPrice: sellPrice,
    };

    // Update bought stocks
    const updatedBoughtStocks = [...boughtStocks];
    const stockIndex = updatedBoughtStocks.findIndex(
      (stock) => stock.id === selectedStock.id
    );

    if (stockIndex !== -1) {
      if (sellQuantity >= selectedStock.quantity) {
        // Remove stock if all shares are sold
        updatedBoughtStocks.splice(stockIndex, 1);
      } else {
        // Reduce quantity if partial shares are sold
        updatedBoughtStocks[stockIndex] = {
          ...updatedBoughtStocks[stockIndex],
          quantity: selectedStock.quantity - sellQuantity,
        };
      }
    }

    // Update state
    setBoughtStocks(updatedBoughtStocks);
    setSoldStocks([...soldStocks, soldStock]);
    closeSellModal();
  };

  //   {
  //     "Price": 66,
  //     "Quantity": 2,
  //     "StockID": "BURNPUR",
  //     "Category": "Buy",
  //     "Email": "man@yopmail.com"
  // },
  // {
  //     "Price": 776,
  //     "Quantity": 3,
  //     "StockID": "MANINDS",
  //     "Category": "Buy",
  //     "Email": "man@yopmail.com"
  // }

  const currenttabdata = () => {
    if (activeTab === "sold") {
      return BuyandSell?.data?.filter((val: any) => val?.Category === "Sold");
    } else {
      return BuyandSell?.data?.filter((val) => val?.Category === "Buy");
    }
  };

  const Getrelatedstock = (vals: any) => {
    const data = stockData.filter((val) => val?.symbol === vals)[0];
    return data;
  };
  const handlesellStock = (val?: any) => {
    setloader(true);
    updateStockStatus(
      localStorage.getItem("mail") || "",
      selectedStock?.StockID,
      "Sold",
      Math.round(Number(selectedStock?.Price)),
      sellQuantity
    ).then(() => {
      setIsSellModalOpen(false);
      setloader(false);
    });
  };
  return (
    <>
      <NavBar />
      {stockData.length === 0 ? (
        <div className="loader" style={{ width: window.innerWidth }}>
          <SvgSpinner width={62} height={62} />
        </div>
      ) : (
        <div className="stock-portfolio">
          <header className="header">
            <h1>Stock Portfolio</h1>
            <div className="portfolio-summary">
              <div className="summary-item">
                <span className="label">Total Stocks:</span>
                <span className="value">{BuyandSell?.data?.length}</span>
              </div>
              <div className="summary-item">
                <span className="label">Sold Stocks:</span>
                <span className="value">
                  {
                    BuyandSell?.data?.filter(
                      (val: any) => val?.Category === "Sold"
                    ).length
                  }
                </span>
              </div>
            </div>
          </header>

          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "bought" ? "active" : ""}`}
              onClick={() => setActiveTab("bought")}
            >
              Bought Stocks
            </button>
            <button
              className={`tab-button ${activeTab === "sold" ? "active" : ""}`}
              onClick={() => setActiveTab("sold")}
            >
              Sold Stocks
            </button>
          </div>

          <main className="main-content">
            {activeTab === "bought" && (
              <section className="bought-stocks-section">
                <div className="stocks-grid">
                  {currenttabdata().length !== 0 ? (
                    <>
                      {currenttabdata()?.map((stock: any) => (
                        <div key={stock.StockID} className="stock-card">
                          <div className="stock-header">
                            <div className="stock-symbol">{stock.StockID}</div>
                            <div className="stock-company">
                              {Getrelatedstock(stock.StockID).name}
                            </div>
                          </div>
                          <div className="stock-details">
                            <div className="detail-row">
                              <span className="detail-label">
                                Purchase Price:
                              </span>
                              <span className="detail-value">
                                ${stock.Price.toFixed(2)}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">
                                Current Price:
                              </span>
                              <span className="detail-value">
                                $
                                {(
                                  Getrelatedstock(stock.StockID).price *
                                  stock.Quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Quantity:</span>
                              <span className="detail-value">
                                {stock.Quantity}
                              </span>
                            </div>
                          </div>
                          <div className="stock-footer">
                            <div
                              className={`profit-loss ${
                                calculateProfitLoss(
                                  stock.Price,
                                  Getrelatedstock(stock.StockID).price *
                                    stock.Quantity
                                ) >= 0
                                  ? "profit"
                                  : "loss"
                              }`}
                            >
                              {calculateProfitLoss(
                                stock.Price,
                                Getrelatedstock(stock.StockID).price *
                                  stock.Quantity
                              ).toFixed(2)}
                              %
                            </div>
                            <button
                              className="sell-button"
                              onClick={() => openSellModal(stock)}
                            >
                              Sell
                            </button>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div
                      className="nodata"
                      style={{ width: window.innerWidth }}
                    >
                      No Data found
                    </div>
                  )}
                </div>
              </section>
            )}

            {activeTab === "sold" && (
              <section className="sold-stocks-section">
                <div className="stocks-grid">
                  {currenttabdata().length !== 0 ? (
                    <>
                      {currenttabdata()?.map((stock: any) => (
                        <div key={stock.StockID} className="stock-card sold">
                          <div className="stock-header">
                            <div className="stock-symbol">{stock.StockID}</div>
                            <div className="stock-company">
                              {Getrelatedstock(stock.StockID).name}
                            </div>
                          </div>
                          <div className="stock-details">
                            <div className="detail-row">
                              <span className="detail-label">Sold Price:</span>
                              <span className="detail-value">
                                ${stock.Price?.toFixed(2)}
                              </span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-label">Quantity:</span>
                              <span className="detail-value">
                                {stock.Quantity}
                              </span>
                            </div>
                          </div>
                          <div className="stock-footer">
                            <div
                              className={`profit-loss ${
                                stock.Price &&
                                calculateProfitLoss(
                                  stock.Price,
                                  Getrelatedstock(stock.StockID).price *
                                    stock.Quantity
                                ) >= 0
                                  ? "profit"
                                  : "loss"
                              }`}
                            >
                              {stock.Price &&
                                calculateProfitLoss(
                                  stock.Price,
                                  Getrelatedstock(stock.StockID).price *
                                    stock.Quantity
                                ).toFixed(2)}
                              %
                            </div>
                            <div className="sold-tag">SOLD</div>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div>No Data found</div>
                  )}
                </div>
              </section>
            )}
          </main>

          {isSellModalOpen && selectedStock && (
            <div className="modal-overlay">
              <div className="sell-modal">
                <h2>Sell Stock</h2>
                <div className="modal-content">
                  <div className="stock-info">
                    <div className="stock-symbol">{selectedStock.StockID}</div>
                    <div className="stock-company">{selectedStock.Price}</div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="currentPrice">Current Price:</label>
                    <input
                      type="number"
                      id="currentPrice"
                      value={Getrelatedstock(selectedStock.StockID).price}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="quantity">
                      Quantity (Max: {selectedStock.Quantity}):
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      value={sellQuantity}
                      onChange={(e) =>
                        setSellQuantity(Number.parseInt(e.target.value))
                      }
                      min="1"
                      max={selectedStock.Quantity}
                    />
                  </div>

                  <div className="total-calculation">
                    <span className="label">Total Sale Value:</span>
                    <span className="value">
                      {(
                        Getrelatedstock(selectedStock.StockID).price *
                        sellQuantity
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  {loader ? (
                    <Button showLoader color={"#fff"} width={"150px"} />
                  ) : (
                    <>
                      <Button
                        labelName={"Cancel"}
                        color={"#1d3d60"}
                        backgroundColor={"#fff"}
                        onClick={closeSellModal}
                      ></Button>

                      <Button
                        labelName={"sale"}
                        onClick={() => handlesellStock(selectedStock.StockID)}
                      ></Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
