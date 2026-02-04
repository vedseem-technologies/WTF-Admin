import './StatsCard.css';

const StatsCard = ({ icon, title, value, subtitle, trend, color = 'primary' }) => {
    return (
        <div className={`stats-card stats-card-${color}`}>
            <div className="stats-icon">
                <span>{icon}</span>
            </div>
            <div className="stats-content">
                <div className="stats-title">{title}</div>
                <div className="stats-value">{value}</div>
                {subtitle && <div className="stats-subtitle">{subtitle}</div>}
                {trend && (
                    <div className={`stats-trend ${trend > 0 ? 'positive' : 'negative'}`}>
                        <span className="trend-icon">{trend > 0 ? '↗' : '↘'}</span>
                        <span className="trend-value">{Math.abs(trend)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
