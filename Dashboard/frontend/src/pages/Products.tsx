import React, { useEffect, useState } from 'react';
import { fetchSalesByProduct } from '../api';
import type { SalesByProduct } from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import ChartCard from '../components/ChartCard';

const Products: React.FC = () => {
  const [productData, setProductData] = useState<SalesByProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchSalesByProduct();
        setProductData(res);
      } catch (error) {
        console.error('Error loading product data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

  if (loading) return <div className="p-8">Loading product data...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Product Performance</h1>
          <p className="text-muted">Analysis of revenue and profit by product line</p>
        </div>
      </header>

      <div className="charts-grid">
        <ChartCard title="Revenue by Product" subtitle="Comparison of product categories" className="full-width">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={productData} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => `$${v/1000000}M`} />
              <YAxis dataKey="product_name" type="category" width={150} />
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default Products;
