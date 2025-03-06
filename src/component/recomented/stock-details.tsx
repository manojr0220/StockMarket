"use client";
import { ArrowDown, ArrowUp } from "lucide-react";
import "./stock-details.css";
import { useEffect, useRef, useState } from "react";
import Button from "../../UIkit/Button/Button";
import { isTokenExpired } from "../../UIkit/accessTokenVerify/accesstokenverify";
import { updateStockStatus } from "../../api/api";
import { useNavigate } from "react-router-dom";

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

interface StockDetailProps {
  stock: Stock;
}

export default function StockDetail({ stock }: StockDetailProps) {
  const isPositive = stock.percentChange > 0;
  const navigate = useNavigate();
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [loader, setloader] = useState<any>(false);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Mock data for the chart
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));

    // Generate a somewhat realistic price trend
    const basePrice = stock.price - stock.price * (stock.percentChange / 100);
    const randomFactor = 1 + (Math.random() - 0.5) * 0.1;
    const trendFactor = 1 + (i / 30) * (stock.percentChange / 100);

    return {
      date: date.toISOString().split("T")[0],
      price: basePrice * randomFactor * trendFactor,
    };
  });
  const handlebuy = (val: any) => {
    const valid = isTokenExpired(localStorage.getItem("token"));
    if (valid) {
      navigate("/login");
    } else {
      setIsSellModalOpen(true);
    }
  };
  const handlebuyStock = (val?: any) => {
    setloader(true);
    updateStockStatus(
      localStorage.getItem("mail") || "",
      val?.symbol,
      "Buy",
      Math.round(Number(stock?.price)),
      sellQuantity
    ).then(() => {
      setIsSellModalOpen(false);
      setloader(false);
    });
  };
  const closebuyModal = () => {
    setIsSellModalOpen(false);
  };
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

        // Set dimensions
        const width = chartRef.current.width;
        const height = chartRef.current.height;
        const padding = 40;

        // Find min and max values
        const prices = chartData.map((d) => d.price);
        const minPrice = Math.min(...prices) * 0.99;
        const maxPrice = Math.max(...prices) * 1.01;

        // Draw axes
        ctx.beginPath();
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();

        // Draw price line
        ctx.beginPath();
        ctx.strokeStyle = isPositive ? "#4ade80" : "#f87171";
        ctx.lineWidth = 2;

        chartData.forEach((dataPoint, i) => {
          const x =
            padding + (i * (width - 2 * padding)) / (chartData.length - 1);
          const y =
            height -
            padding -
            ((dataPoint.price - minPrice) / (maxPrice - minPrice)) *
              (height - 2 * padding);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.stroke();

        // Fill area under the line
        ctx.lineTo(
          padding +
            ((chartData.length - 1) * (width - 2 * padding)) /
              (chartData.length - 1),
          height - padding
        );
        ctx.lineTo(padding, height - padding);
        ctx.fillStyle = isPositive
          ? "rgba(74, 222, 128, 0.1)"
          : "rgba(248, 113, 113, 0.1)";
        ctx.fill();

        // Draw labels
        ctx.fillStyle = "#888";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";

        // X-axis labels (dates)
        for (let i = 0; i < chartData.length; i += 5) {
          const x =
            padding + (i * (width - 2 * padding)) / (chartData.length - 1);
          const date = new Date(chartData[i].date);
          const label = `${date.getMonth() + 1}/${date.getDate()}`;
          ctx.fillText(label, x, height - padding + 15);
        }

        // Y-axis labels (prices)
        ctx.textAlign = "right";
        const priceStep = (maxPrice - minPrice) / 4;
        for (let i = 0; i <= 4; i++) {
          const price = minPrice + i * priceStep;
          const y = height - padding - (i * (height - 2 * padding)) / 4;
          ctx.fillText(`$${price.toFixed(2)}`, padding - 5, y + 4);
        }
      }
    }
  }, [chartData, isPositive]);

  return (
    <div className="stock-detail">
      <div className="stock-detail-header-info">
        <div style={{ width: "100%" }}>
          <div className="heading">
            <h2 className="stock-detail-symbol">
              {stock.symbol}
              <span className="stock-detail-name">({stock.name})</span>
            </h2>
            <div>
              <Button
                labelName={"Buy"}
                onClick={() => handlebuy(stock)}
                width={100}
              ></Button>
            </div>
          </div>
          <div className="stock-detail-price-info">
            <span className="stock-detail-current-price">
              ${stock.price.toFixed(2)}
            </span>
            <span
              className={`stock-detail-change ${
                isPositive ? "positive" : "negative"
              }`}
            >
              {isPositive ? (
                <ArrowUp className="arrow-icon" />
              ) : (
                <ArrowDown className="arrow-icon" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.percentChange.toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="stock-chart-container">
        <canvas
          ref={chartRef}
          width="800"
          height="300"
          className="stock-chart"
        ></canvas>
      </div>

      <table className="stock-table">
        <thead>
          <tr>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Volume</th>
            <th>Market Cap</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${(stock.price - stock.change).toFixed(2)}</td>
            <td>${(stock.price * 1.02).toFixed(2)}</td>
            <td>${(stock.price * 0.98).toFixed(2)}</td>
            <td>{stock.volume.toLocaleString()}</td>
            <td>${(stock.marketCap / 1000000000).toFixed(2)}B</td>
          </tr>
        </tbody>
      </table>

      <div className="stock-detail-grid">
        <div className="stock-overview">
          <h3>Company Overview</h3>
          <p>{stock.description}</p>
        </div>
        <div className="stock-statistics">
          <h3>Key Statistics</h3>
          <div className="statistics-grid">
            <div className="statistic-item">
              <p className="statistic-label">52 Week High</p>
              <p className="statistic-value">
                ${(stock.price * 1.3).toFixed(2)}
              </p>
            </div>
            <div className="statistic-item">
              <p className="statistic-label">52 Week Low</p>
              <p className="statistic-value">
                ${(stock.price * 0.7).toFixed(2)}
              </p>
            </div>
            <div className="statistic-item">
              <p className="statistic-label">P/E Ratio</p>
              <p className="statistic-value">
                {(Math.random() * 30 + 5).toFixed(2)}
              </p>
            </div>
            <div className="statistic-item">
              <p className="statistic-label">Dividend Yield</p>
              <p className="statistic-value">
                {(Math.random() * 5).toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSellModalOpen && stock && (
        <div className="modal-overlay">
          <div className="sell-modal">
            <h2>Buy Stock</h2>
            <div className="modal-content">
              <div className="stock-info">
                <div className="stock-symbol">{stock?.symbol}</div>
                <div className="stock-company">{stock?.name}</div>
              </div>

              <div className="form-group">
                <label htmlFor="currentPrice">Current Price ($):</label>
                <input
                  type="number"
                  id="currentPrice"
                  readOnly
                  value={stock?.price}
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity (Max: {10}):</label>
                <input
                  type="number"
                  id="quantity"
                  value={sellQuantity}
                  onChange={(e) =>
                    setSellQuantity(Number.parseInt(e.target.value))
                  }
                  min="1"
                  max={10}
                />
              </div>

              <div className="total-calculation">
                <span className="label">Total Sale Value:</span>
                <span className="value">
                  ${(stock?.price * sellQuantity).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              {loader ? (
                <Button showLoader color={"#fff"} width={"150px"} />
              ) : (
                <>
                  <Button
                    labelName={"cancel"}
                    color={"#1d3d60"}
                    backgroundColor={"#fff"}
                    onClick={closebuyModal}
                  ></Button>

                  <Button
                    labelName={"Buy"}
                    onClick={() => handlebuyStock(stock || "")}
                  ></Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
