import React from 'react';
import type { TopCity } from '../api';

interface TopCitiesTableProps {
  cities: TopCity[];
}

const TopCitiesTable: React.FC<TopCitiesTableProps> = ({ cities }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Region</th>
            <th>Revenue</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={`${city.city}-${index}`}>
              <td>
                <div className="city-name">{city.city}</div>
                <div className="city-state">{city.state}</div>
              </td>
              <td>{city.region}</td>
              <td className="font-semibold">{formatCurrency(city.revenue)}</td>
              <td className="text-green-600">{formatCurrency(city.profit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCitiesTable;
