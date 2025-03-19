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

// Define a generic data item type
interface DataItem {
  [key: string]: string | number;
}

interface DataChartProps<T extends DataItem> {
  data: T[];
  type?: ChartType;
  xKey: keyof T;
  yKeys: Array<keyof T>;
  colors?: string[];
  title?: string;
  height?: number;
}

export default function DataChart<T extends DataItem>({
  data,
  type = 'line',
  xKey,
  yKeys,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'],
  title,
  height = 300,
}: DataChartProps<T>) {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Line
                key={key as string}
                type="monotone"
                dataKey={key as string}
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
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
            {yKeys.map((key, index) => (
              <Bar
                key={key as string}
                dataKey={key as string}
                fill={colors[index % colors.length]}
              />
            ))}
          </BarChart>
        );
      default:
        // Return empty LineChart as fallback instead of null
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey as string} />
            <YAxis />
            <Tooltip />
            <Legend />
          </LineChart>
        );
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