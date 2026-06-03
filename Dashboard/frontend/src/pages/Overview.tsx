import React, { useEffect, useState } from 'react';
import { fetchKPIs, fetchMonthlyTrend, fetchSalesByMethod } from '../api';
import type { KPIStore, MonthlyTrend, SalesByMethod } from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag, Percent } from 'lucide-react';
import KPICard from '../components/KPICard';
import ChartCard from '../components/ChartCard';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Overview: React.FC = () => {
  const [kpis, setKpis] = useState<KPIStore | null>(null);
  const [trendData, setTrendData] = useState<MonthlyTrend[]>([]);
  const [methodData, setMethodData] = useState<SalesByMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [kpiRes, trendRes, methodRes] = await Promise.all([
          fetchKPIs(),
          fetchMonthlyTrend(),
          fetchSalesByMethod(),
        ]);
        setKpis(kpiRes);
        setTrendData(trendRes);
        setMethodData(methodRes);
      } catch (error) {
        console.error('Error loading overview data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`;

  if (loading) return <div className="p-8">Loading overview...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Executive Overview</h1>
          <p className="text-muted">High-level sales performance metrics</p>
        </div>
      </header>

      <div className="kpi-grid">
        <KPICard title="Revenue" value={formatCurrency(kpis?.total_revenue || 0)} icon={DollarSign} trend={{ value: 12, isPositive: true }} colorClass="text-blue-500" />
        <KPICard title="Profit" value={formatCurrency(kpis?.total_profit || 0)} icon={TrendingUp} trend={{ value: 8, isPositive: true }} colorClass="text-green-500" />
        <KPICard title="Units" value={(kpis?.total_units || 0).toLocaleString()} icon={ShoppingBag} trend={{ value: 3, isPositive: false }} colorClass="text-orange-500" />
        <KPICard title="Margin" value={formatPercent(kpis?.avg_margin || 0)} icon={Percent} colorClass="text-purple-500" />
      </div>

      <div className="charts-grid">
        <ChartCard title="Revenue Growth" subtitle="Year-over-year trend" className="full-width">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickFormatter={(m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]} />
              <YAxis tickFormatter={(v) => `$${v/1000000}M`} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sales Channels" subtitle="Method contribution" className="span-4">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={methodData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="revenue" nameKey="sales_method">
                {methodData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Overview;
