import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { cn } from "../../UIkit/util";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataPoint {
  date: string;
  price: string;
}

interface ChartProps {
  data: ChartDataPoint[];
  x?: keyof ChartDataPoint;
  y?: keyof ChartDataPoint;
  config?: {
    price?: {
      label?: string;
      color?: string;
    };
  };
}

export const Chart: React.FC<ChartProps> = ({ data, x = "date", y = "price", config }) => {
  const chartData = {
    labels: data.map((item) => item[x]),
    datasets: [
      {
        label: config?.price?.label || "Price",
        data: data.map((item) => parseFloat(item[y] as string)),
        borderColor: config?.price?.color || "hsl(var(--chart-1))",
        backgroundColor: config?.price?.color || "hsl(var(--chart-1))",
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

interface ChartContainerProps {
  className?: string;
  children?: React.ReactNode;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({ className, children }) => {
  return <div className={cn("relative", className)}>{children}</div>;
};
