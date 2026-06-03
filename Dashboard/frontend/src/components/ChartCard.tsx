import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, subtitle, className = '' }) => {
  return (
    <div className={`chart-card ${className}`}>
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {subtitle && <p className="chart-subtitle">{subtitle}</p>}
      </div>
      <div className="chart-body">
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
