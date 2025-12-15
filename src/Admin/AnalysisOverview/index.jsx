import { FiEye } from "react-icons/fi";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import StatsCard from "../Dashboard/stats-card";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LuTag } from "react-icons/lu";
import { FaEye } from "react-icons/fa6";
import { HiMiniArrowTrendingUp } from "react-icons/hi2";
import {
  useGetAnalysisDataQuery,
  useGetUserGrowthQuery,
  useGetContentTypeBreakdownQuery,
  useGetContentLikeShareQuery,
  useGetMostViewedQuery,
} from "../../Redux/services/dashboardApi";
import { userSideUrl } from "@/configtion";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
        <p className="text-white text-sm font-medium">{payload[0].name}</p>
        <p className="text-gray-300 text-sm">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsOverview() {
  const { data: analysisData, isLoading: analysisLoading } =
    useGetAnalysisDataQuery();
  const { data: userGrowth, isLoading: userGrowthLoading } =
    useGetUserGrowthQuery();
  const { data: contentTypeBreakdown, isLoading: contentTypeLoading } =
    useGetContentTypeBreakdownQuery();
  const { data: contentLikeShare, isLoading: likeShareLoading } =
    useGetContentLikeShareQuery();
  const { data: mostViewed, isLoading: mostViewedLoading } =
    useGetMostViewedQuery();

  const statsData = [
    {
      title: "Total Content",
      value: analysisData?.data?.total_contents?.toString() || "0",
      change: `+${analysisData?.data?.percent_change?.contents}%`,
      period: "from last month",
      icon: (
        <div className="bg-pink-700/30 text-pink-700  p-3 rounded-full flex justify-center items-center">
          <IoDocumentTextOutline />
        </div>
      ),
      shadowColor: "rgba(255,57,176,1.00)",
    },
    {
      title: "Total Users",
      value: analysisData?.data?.total_users?.toString() || "0",
      change: `+${analysisData?.data?.percent_change?.users}%`,
      period: "from last month",
      icon: (
        <div className="bg-[rgba(192,255,76,1.00)]/30 text-[rgba(192,255,76,1.00)]  p-3 rounded-full flex justify-center items-center">
          <LuUsers />
        </div>
      ),
      shadowColor: "rgba(192,255,76,1.00)",
    },
    {
      title: "Total View",
      value: analysisData?.data?.total_views?.toString() || "0",
      change: `+${analysisData?.data?.percent_change?.views}%`,
      period: ` from last month`,
      icon: (
        <div className="bg-pink-700/30 text-pink-700  p-3 rounded-full flex justify-center items-center">
          <FaEye />
        </div>
      ),
      shadowColor: "rgba(255,57,176,1.00)",
    },
    {
      title: "Total Tags",
      value: analysisData?.data?.total_tags?.toString() || "0",
      change: `+${analysisData?.data?.percent_change?.tags}%`,
      period: "from last month",
      icon: (
        <div className="bg-[rgba(192,255,76,1.00)]/30 text-[rgba(192,255,76,1.00)]  p-3 rounded-full flex justify-center items-center">
          <LuTag />
        </div>
      ),
      shadowColor: "rgba(192,255,76,1.00)",
    },
  ];

  const userGrowthChartData =
    userGrowth?.data?.labels?.map((label, index) => ({
      month: label,
      users: userGrowth?.data?.data[index] || 0,
    })) || [];

  const contentTypeChartData =
    contentTypeBreakdown?.data?.breakdown?.map((item) => ({
      name: item.content_type,
      value: item.percent,
      color: getColorForType(item.content_type),
    })) || [];

  const engagementChartData =
    contentLikeShare?.data?.labels?.map((label, index) => ({
      category: label,
      likes: contentLikeShare?.data?.likes[index] || 0,
      shares: contentLikeShare?.data?.shares[index] || 0,
    })) || [];

  const mostViewedData = mostViewed?.data?.top || [];

  function getColorForType(type) {
    const colors = {
      Article: "#3b82f6",
      Video: "#ec4899",
      PDF: "#84cc16",
      Blog: "#f59e0b",
      Image: "#8b5cf6",
    };
    return colors[type] || "#6b7280";
  }
  return (
    <div>
      <div>
        <div className="flex justify-between mb-5 ">
          <div className="text-3xl font-bold text-white mb-2">
            Analysis Overview
          </div>
          <div className="text-sm font-bold text-gray-400 mb-2">
            Last updated: Today, 12:30 PM
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>
      <div className=" space-y-6 mt-10">
        {/* Top Row - User Growth and Content Type Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">User Growth</h2>
              <span className="text-pink-500 gap-1 flex items-center text-sm font-medium">
                <HiMiniArrowTrendingUp /> +12% this month
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthChartData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fill="url(#userGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Content Type Breakdown Pie Chart */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <h2 className="text-white text-xl font-semibold mb-6">
              Content Type Breakdown
            </h2>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentTypeChartData}
                    cx="50%"
                    cy="50%"
                    // innerRadius={50}
                    outerRadius={100}
                    // paddingAngle={2}
                    dataKey="value"
                  >
                    {contentTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              {contentTypeChartData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-300 text-sm">
                    {item.name} {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Engagement Chart and Most Viewed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Like & Share by Type */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <h2 className="text-white text-xl font-semibold mb-6">
              Content Like & Share by Type
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={engagementChartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="category"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#fff" }}
                  itemStyle={{ color: "#d1d5db" }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="#831D9F"
                  strokeWidth={3}
                  dot={{ fill: "#831D9F", r: 5 }}
                  name="Likes"
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="#503683"
                  strokeWidth={3}
                  dot={{ fill: "#503683", r: 5 }}
                  name="Shares"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Most Viewed Content */}
          <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">
                Most Viewed Content
              </h2>
              <button className="text-pink-500 text-sm font-medium hover:text-pink-400 transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {mostViewedData.map((content, index) => (
                <div
                  onClick={() => {
                    // window.open(
                    //   `${userSideUrl}/content-details/${content.id}`,
                    //   "_blank"
                    // );
                  }}
                  key={content.id}
                  className="flex items-center gap-3 p-3 border border-gray-500/50 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div
                    style={{
                      background:
                        content.content_type == "PDF"
                          ? "#ef4444"
                          : content.content_type == "Video"
                          ? "#FF39B0"
                          : content.content_type == "Article"
                          ? "#A855F7"
                          : content.content_type == "Image"
                          ? "#3B82F6"
                          : content.content_type == "Blog"
                          ? "#C0FF4C"
                          : "gray",
                    }}
                    className={`flex-shrink-0 w-4 h-4 rounded-full 
                   flex items-center justify-center opacity-20`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm mb-1 truncate">
                      {content.title}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {content.content_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiEye className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {content.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
