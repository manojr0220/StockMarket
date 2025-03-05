"use client";

import { useState } from "react";
import "./Stocksscreen.css";
import NavBar from "../navbar/Navbar";

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
  // Sample data - in a real app this would come from an API
  const [boughtStocks, setBoughtStocks] = useState<Stock[]>([
    {
      id: "1",
      symbol: "AAPL",
      companyName: "Apple Inc.",
      purchasePrice: 150.75,
      currentPrice: 175.25,
      quantity: 10,
      purchaseDate: "2023-01-15",
    },
    {
      id: "2",
      symbol: "MSFT",
      companyName: "Microsoft Corporation",
      purchasePrice: 245.3,
      currentPrice: 240.15,
      quantity: 5,
      purchaseDate: "2023-02-20",
    },
    {
      id: "3",
      symbol: "GOOGL",
      companyName: "Alphabet Inc.",
      purchasePrice: 2250.8,
      currentPrice: 2400.5,
      quantity: 2,
      purchaseDate: "2023-03-10",
    },
    {
      id: "4",
      symbol: "AMZN",
      companyName: "Amazon.com Inc.",
      purchasePrice: 3100.25,
      currentPrice: 3250.75,
      quantity: 3,
      purchaseDate: "2023-04-05",
    },
  ]);

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

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const [activeTab, setActiveTab] = useState<"bought" | "sold">("bought");

  // Calculate profit/loss
  const calculateProfitLoss = (purchasePrice: number, currentPrice: number) => {
    return ((currentPrice - purchasePrice) / purchasePrice) * 100;
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

  return (
    <>
      <NavBar />
      <div className="stock-portfolio">
        <header className="header">
          <h1>Stock Portfolio</h1>
          <div className="portfolio-summary">
            <div className="summary-item">
              <span className="label">Total Stocks:</span>
              <span className="value">{boughtStocks.length}</span>
            </div>
            <div className="summary-item">
              <span className="label">Sold Stocks:</span>
              <span className="value">{soldStocks.length}</span>
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
                {boughtStocks.map((stock) => (
                  <div key={stock.id} className="stock-card">
                    <div className="stock-header">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-company">{stock.companyName}</div>
                    </div>
                    <div className="stock-details">
                      <div className="detail-row">
                        <span className="detail-label">Purchase Price:</span>
                        <span className="detail-value">
                          ${stock.purchasePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Current Price:</span>
                        <span className="detail-value">
                          ${stock.currentPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{stock.quantity}</span>
                      </div>
                    </div>
                    <div className="stock-footer">
                      <div
                        className={`profit-loss ${
                          calculateProfitLoss(
                            stock.purchasePrice,
                            stock.currentPrice
                          ) >= 0
                            ? "profit"
                            : "loss"
                        }`}
                      >
                        {calculateProfitLoss(
                          stock.purchasePrice,
                          stock.currentPrice
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
              </div>
            </section>
          )}

          {activeTab === "sold" && (
            <section className="sold-stocks-section">
              <div className="stocks-grid">
                {soldStocks.map((stock) => (
                  <div key={stock.id} className="stock-card sold">
                    <div className="stock-header">
                      <div className="stock-symbol">{stock.symbol}</div>
                      <div className="stock-company">{stock.companyName}</div>
                    </div>
                    <div className="stock-details">
                      <div className="detail-row">
                        <span className="detail-label">Purchase Price:</span>
                        <span className="detail-value">
                          ${stock.purchasePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Sold Price:</span>
                        <span className="detail-value">
                          ${stock.soldPrice?.toFixed(2)}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Quantity:</span>
                        <span className="detail-value">{stock.quantity}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Sold Date:</span>
                        <span className="detail-value">{stock.soldDate}</span>
                      </div>
                    </div>
                    <div className="stock-footer">
                      <div
                        className={`profit-loss ${
                          stock.soldPrice &&
                          calculateProfitLoss(
                            stock.purchasePrice,
                            stock.soldPrice
                          ) >= 0
                            ? "profit"
                            : "loss"
                        }`}
                      >
                        {stock.soldPrice &&
                          calculateProfitLoss(
                            stock.purchasePrice,
                            stock.soldPrice
                          ).toFixed(2)}
                        %
                      </div>
                      <div className="sold-tag">SOLD</div>
                    </div>
                  </div>
                ))}
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
                  <div className="stock-symbol">{selectedStock.symbol}</div>
                  <div className="stock-company">
                    {selectedStock.companyName}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="currentPrice">Current Price ($):</label>
                  <input
                    type="number"
                    id="currentPrice"
                    value={sellPrice}
                    onChange={(e) =>
                      setSellPrice(Number.parseFloat(e.target.value))
                    }
                    min="0.01"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">
                    Quantity (Max: {selectedStock.quantity}):
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    value={sellQuantity}
                    onChange={(e) =>
                      setSellQuantity(Number.parseInt(e.target.value))
                    }
                    min="1"
                    max={selectedStock.quantity}
                  />
                </div>

                <div className="total-calculation">
                  <span className="label">Total Sale Value:</span>
                  <span className="value">
                    ${(sellPrice * sellQuantity).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button className="cancel-button" onClick={closeSellModal}>
                  Cancel
                </button>
                <button className="confirm-button" onClick={handleSellStock}>
                  Confirm Sale
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
