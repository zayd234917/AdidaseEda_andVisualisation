import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, icon: Icon, trend, colorClass = 'text-blue-500' }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className={`kpi-icon-container ${colorClass}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`kpi-trend ${trend.isPositive ? 'trend-up' : 'trend-down'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="kpi-content">
        <span className="kpi-title">{title}</span>
        <h3 className="kpi-value">{value}</h3>
      </div>
    </div>
  );
};

export default KPICard;
