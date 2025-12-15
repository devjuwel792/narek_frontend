import StatsCard from "./stats-card.jsx";
import TrafficChart from "./traffic-chart.jsx";
import ContentBreakdown from "./content-breakdown.jsx";
import RecentContent from "./recent-content.jsx";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { IoMdCheckboxOutline } from "react-icons/io";
import { LuTag } from "react-icons/lu";
import { useGetDashboardStatsQuery } from "../../Redux/services/dashboardApi";
import { useEffect, useState } from "react";

export default function MainDashboard() {
  const { data: dashboardData, isLoading, error } = useGetDashboardStatsQuery();

  // lastUpdated state — update when dashboard data arrives and every minute
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // When new dashboard data arrives, mark lastUpdated to now
  useEffect(() => {
    if (dashboardData) setLastUpdated(new Date());
  }, [dashboardData]);

  // Keep the displayed time fresh: update every minute
  useEffect(() => {
    const id = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const formatLastUpdated = (date) => {
    if (!date) return "";
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    if (isToday) return `Today, ${timeStr}`;
    // e.g. Oct 27, 12:30 PM
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statsData = dashboardData
    ? [
        {
          title: "Total Content",
          value: dashboardData.data.total_contents.toString(),
          change: `+${dashboardData.data.percent_change?.contents}%`,
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
          value: dashboardData.data.total_users.toString(),
          change: `+${dashboardData.data.percent_change.users}%`,
          period: "from last month",
          icon: (
            <div className="bg-[rgba(192,255,76,1.00)]/30 text-[rgba(192,255,76,1.00)]  p-3 rounded-full flex justify-center items-center">
              <LuUsers />
            </div>
          ),
          shadowColor: "rgba(192,255,76,1.00)",
        },
        {
          title: "Total Views",
          value: dashboardData.data.total_views.toString(),
          change: `+${dashboardData?.data?.percent_change?.views || 0}%`,
          period: "from last month",
          icon: (
            <div className="bg-pink-700/30 text-pink-700  p-3 rounded-full flex justify-center items-center">
              <IoMdCheckboxOutline />
            </div>
          ),
          shadowColor: "rgba(255,57,176,1.00)",
        },
        {
          title: "Total Tags",
          value: dashboardData.data.total_tags.toString(),
          change: `+${dashboardData.data.percent_change.tags}%`,
          period: "from last month",
          icon: (
            <div className="bg-[rgba(192,255,76,1.00)]/30 text-[rgba(192,255,76,1.00)]  p-3 rounded-full flex justify-center items-center">
              <LuTag />
            </div>
          ),
          shadowColor: "rgba(192,255,76,1.00)",
        },
      ]
    : [];

  return (
    <div className=" space-y-6">
      <div>
        <div className="flex justify-between ">
          <div
            className="text-3xl font-bold text-white mb-2
          "
          >
            Dashboard Overview
          </div>
          <div className="text-sm font-bold text-gray-400 mb-2">
            Last updated: {formatLastUpdated(lastUpdated)}
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrafficChart />
        <ContentBreakdown />
      </div>

      {/* Recent Content Table */}
      <RecentContent />
    </div>
  );
}
