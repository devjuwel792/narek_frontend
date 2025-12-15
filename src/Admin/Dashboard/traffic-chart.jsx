import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import { useGetTrafficTrendsQuery } from "../../Redux/services/dashboardApi";

export default function TrafficChart() {
  const { data: apiData, isLoading, error } = useGetTrafficTrendsQuery();

  const data = apiData?.data ? apiData.data.labels.map((label, index) => ({
    day: label,
    value: apiData.data.data[index],
  })) : [];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-pink-500 rounded-lg px-3 py-2">
          <p className="text-white text-sm font-semibold">
            {payload[0].value} views
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0F0F0F] backdrop-blur-sm rounded-xl p-6 border-2  border-pink-700/50 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-bold">Traffic Trends</h3>
        <span className="text-pink-500 flex gap-1 items-center ">
          <HiMiniArrowTrendingUp /> +14% this week
        </span>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#ec4899" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="day"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ec4899"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
