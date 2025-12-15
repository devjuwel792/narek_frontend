import { useNavigate } from "react-router-dom";
import { useGetRecentContentsQuery } from "../../Redux/services/dashboardApi";

export default function RecentContent() {
  const { data: recentData, isLoading, error } = useGetRecentContentsQuery();
  const navigation = useNavigate();

  const content = recentData
    ? recentData.data.recent_contents.map((item) => ({
        title: item.title,
        type: item.content_type,
        status: "Published",
        views: 0,
        date: new Date(item.created_at).toLocaleDateString(),
      }))
    : [];

  return (
    <div className="bg-[#0F0F0F]  rounded-xl p-6 border-2 border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-xl font-bold">Recent Content</h3>
        <button
          onClick={() => navigation("/admin/content-management")}
          className="text-pink-400 text-sm  transition-colors"
        >
          View All
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium pb-3">
                Title
              </th>
              {/* <th className="text-left text-gray-400 text-sm font-medium pb-3">
                Type
              </th> */}
              <th className="text-left text-gray-400 text-sm font-medium pb-3">
                Status
              </th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">
                Views
              </th>
              <th className="text-left text-gray-400 text-sm font-medium pb-3">
                Date Created
              </th>
            </tr>
          </thead>
          <tbody>
            {content.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-800/75 hover:bg-gray-800/30 transition-colors"
              >
                <td className="py-4 text-white">{item.title}</td>
         
                <td className="py-4">
                  <span
                    className={`${
                      item.status.toLowerCase() == "published"
                        ? "bg-green-400/20 text-green-400"
                        : "bg-yellow-600/20 text-yellow-600"
                    }  text-xs px-3 py-1 rounded-full`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-4 text-white">{item.views}</td>
                <td className="py-4 text-gray-400">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
