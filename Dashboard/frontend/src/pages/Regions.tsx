import React, { useEffect, useState } from 'react';
import { fetchSalesByRegion, fetchTopCities } from '../api';
import type { SalesByRegion, TopCity } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from '../components/ChartCard';
import TopCitiesTable from '../components/TopCitiesTable';

const Regions: React.FC = () => {
  const [regionData, setRegionData] = useState<SalesByRegion[]>([]);
  const [cityData, setCityData] = useState<TopCity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [regRes, cityRes] = await Promise.all([
          fetchSalesByRegion(),
          fetchTopCities(10),
        ]);
        setRegionData(regRes);
        setCityData(cityRes);
      } catch (error) {
        console.error('Error loading regional data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  if (loading) return <div className="p-8">Loading regional data...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Geographic Analysis</h1>
          <p className="text-muted">Performance breakdown by region and city</p>
        </div>
      </header>

      <div className="charts-grid">
        <ChartCard title="Regional Revenue" subtitle="Total sales by territory" className="span-8">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={regionData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="region" />
              <YAxis tickFormatter={(v) => `$${v/1000000}M`} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 10 Cities" subtitle="Highest revenue generation" className="span-4">
          <TopCitiesTable cities={cityData} />
        </ChartCard>
      </div>
    </div>
  );
};

export default Regions;
