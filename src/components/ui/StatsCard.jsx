const colorMap = {
  primary: {
    bg: "bg-primary/10",
    icon: "bg-primary-gradient",
    text: "text-primary",
  },
  success: {
    bg: "bg-success-light",
    icon: "bg-gradient-to-br from-success to-emerald-400",
    text: "text-success",
  },
  warning: {
    bg: "bg-warning-light",
    icon: "bg-gradient-to-br from-warning to-yellow-300",
    text: "text-warning",
  },
  danger: {
    bg: "bg-danger-light",
    icon: "bg-gradient-to-br from-danger to-rose-400",
    text: "text-danger",
  },
  info: {
    bg: "bg-info-light",
    icon: "bg-gradient-to-br from-info to-blue-400",
    text: "text-info",
  },
};

const StatsCard = ({
  icon,
  title,
  value,
  subtitle,
  trend,
  color = "primary",
}) => {
  const colors = colorMap[color] || colorMap.primary;
  return (
    <div
      className={`${colors.bg} rounded-xl p-5 flex items-center gap-4 border border-white/60 shadow-sm hover:shadow-md transition-all`}
    >
      <div
        className={`${colors.icon} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          {title}
        </div>
        <div className="text-2xl font-bold text-secondary leading-none mb-1">
          {value}
        </div>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
        {trend !== undefined && (
          <div
            className={`inline-flex items-center gap-1 mt-1 text-xs font-semibold ${trend > 0 ? "text-success" : "text-danger"}`}
          >
            <span>{trend > 0 ? "↗" : "↘"}</span>
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
