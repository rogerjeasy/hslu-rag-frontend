'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

type ChartType = 'line' | 'bar';

interface DataChartProps {
  data: any[];
  type?: ChartType;
  xKey: string;
  yKeys: string[];
  colors?: string[];
  title?: string;
  height?: number;
}

export default function DataChart({
  data,
  type = 'line',
  xKey,
  yKeys,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'],
  title,
  height = 300,
}: DataChartProps) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}