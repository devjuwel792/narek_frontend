"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetContentBreakdownQuery } from "../../Redux/services/dashboardApi";

export default function ContentBreakdown() {
  const {
    data: breakdownData,
    isLoading,
    error,
  } = useGetContentBreakdownQuery();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const initialData = breakdownData ? breakdownData.data.breakdown : [];
    if (!initialData || !initialData.length) {
      setChartData([]);
      return;
    }

    setChartData(
      initialData.map((item) => ({
        label: item.content_type,
        value: item.count,
        fill: "#C0FF4C",
      }))
    );
  }, [breakdownData]);
  
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-lime-400 rounded-lg px-3 py-2">
          <p className="text-white text-sm font-semibold">
            {payload[0].payload.label}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0F0F0F] backdrop-blur-sm rounded-xl p-6 border-2 border-lime-700/50 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-bold">Content Type Breakdown</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#374151"
                opacity={0.2}
              />
              <XAxis
                dataKey="label"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={{ stroke: "#374151" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
              />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill="url(#barGradient)"
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />{" "}
                  {/* top — blue-400 */}
                  <stop offset="100%" stopColor="#3b82f6" />{" "}
                  {/* bottom — blue-500 */}
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
      </div>
    </div>
  );
}
