export default function StatsCard({
  title,
  value,
  change,
  period,
  icon,
  shadowColor,
}) {
  return (
    <div
      style={{ boxShadow: `0px 0px 20px 0px ${shadowColor}` }}
      className="bg-[#0F0F0F]  rounded-xl p-6 relative overflow-hidden"
    >
    

      <div className="flex items-start justify-between ">
        <h3 className="text-gray-400 text font-medium">{title}</h3>
        <span className="text-2xl rounded-full">{icon}</span>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        {change && (
          <p className="text-sm text-[#C0FF4C]">
            {change} {period}
          </p>
        )}
      </div>
    </div>
  );
}
