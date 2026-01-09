import { TrendingUp, TrendingDown } from "lucide-react";

function StatsCard({ title, value, color, icon: Icon, trend, trendValue }) {
  // Mapping Bootstrap colors to hex/rgba for icons
  const colorMap = {
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    info: "#06b6d4",
    danger: "#ef4444",
  };

  return (
    <div className="dashboard-card">
      <div 
        className="stat-icon" 
        style={{ background: `${colorMap[color]}15`, color: colorMap[color] }}
      >
        <Icon size={24} />
      </div>
      
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      
      {trend && (
        <div className="mt-2">
          <span className={`trend-badge ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </span>
          <span className="text-muted smaller ms-1" style={{ fontSize: '0.75rem' }}>vs last month</span>
        </div>
      )}
    </div>
  );
}

export default StatsCard;
