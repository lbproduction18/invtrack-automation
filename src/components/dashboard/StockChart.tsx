
import React from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Mock data for the stock chart
const stockData = [
  {
    date: '2023-09-01',
    Electronics: 120,
    Clothing: 220,
    'Home Goods': 150,
    Accessories: 90,
    Beauty: 70,
  },
  {
    date: '2023-09-06',
    Electronics: 132,
    Clothing: 210,
    'Home Goods': 142,
    Accessories: 85,
    Beauty: 85,
  },
  {
    date: '2023-09-11',
    Electronics: 125,
    Clothing: 190,
    'Home Goods': 130,
    Accessories: 95,
    Beauty: 80,
  },
  {
    date: '2023-09-16',
    Electronics: 110,
    Clothing: 175,
    'Home Goods': 128,
    Accessories: 100,
    Beauty: 75,
  },
  {
    date: '2023-09-21',
    Electronics: 95,
    Clothing: 195,
    'Home Goods': 115,
    Accessories: 110,
    Beauty: 85,
  },
  {
    date: '2023-09-26',
    Electronics: 85,
    Clothing: 205,
    'Home Goods': 100,
    Accessories: 115,
    Beauty: 90,
  },
  {
    date: '2023-10-01',
    Electronics: 75,
    Clothing: 215,
    'Home Goods': 90,
    Accessories: 125,
    Beauty: 95,
  },
  {
    date: '2023-10-06',
    Electronics: 65,
    Clothing: 225,
    'Home Goods': 75,
    Accessories: 130,
    Beauty: 100,
  },
  {
    date: '2023-10-11',
    Electronics: 55,
    Clothing: 235,
    'Home Goods': 65,
    Accessories: 140,
    Beauty: 105,
  },
  {
    date: '2023-10-16',
    Electronics: 45,
    Clothing: 245,
    'Home Goods': 55,
    Accessories: 145,
    Beauty: 90,
  },
];

// Format date for display on x-axis
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover shadow-md rounded-md p-2 border border-border text-sm">
        <p className="font-medium mb-1">{formatDate(label)}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`tooltip-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-popover-foreground">{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const StockChart: React.FC = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={stockData}
          margin={{
            top: 10,
            right: 10,
            left: -20, // Negative margin to align better with content
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorElectronics" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorClothing" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorHomeGoods" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--danger))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--danger))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAccessories" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorBeauty" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="Electronics"
            stroke="hsl(var(--primary))"
            fill="url(#colorElectronics)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Clothing"
            stroke="hsl(var(--success))"
            fill="url(#colorClothing)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Home Goods"
            stroke="hsl(var(--danger))"
            fill="url(#colorHomeGoods)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Accessories"
            stroke="hsl(var(--warning))"
            fill="url(#colorAccessories)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Beauty"
            stroke="hsl(var(--info))"
            fill="url(#colorBeauty)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
