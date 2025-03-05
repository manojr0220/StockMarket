import { ArrowDown, ArrowUp } from "lucide-react";
import "./stock-card.css";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
  volume: number;
  marketCap: number;
}

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
}

export default function StockCard({ stock, onClick }: StockCardProps) {
  const isPositive = stock.percentChange > 0;

  return (
    <div
      className={`stock-card ${isPositive ? "positive" : "negative"}`}
      onClick={onClick}
    >
      <div className="stock-card-content">
        <div className="stock-info">
          <h3 className="stock-symbol">{stock.symbol}</h3>
          <p className="stock-name">{stock.name}</p>
        </div>
        <div className={`stock-price ${isPositive ? "positive" : "negative"}`}>
          <p className="price-value">${Number(stock.price).toFixed(2)}</p>
          <div className="price-change">
            {isPositive ? (
              <ArrowUp className="arrow-icon" />
            ) : (
              <ArrowDown className="arrow-icon" />
            )}
            <span>
              {isPositive ? "+" : ""}
              {Number(stock.percentChange).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
      <div className="stock-card-footer">
        <span>Vol: {stock.volume.toLocaleString()}</span>
        <span>
          Mkt Cap: ${(Number(stock.marketCap) / 1000000000).toFixed(2)}B
        </span>
      </div>
    </div>
  );
}
