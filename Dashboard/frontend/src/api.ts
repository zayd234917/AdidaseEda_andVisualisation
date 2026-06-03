import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export interface KPIStore {
  total_revenue: number;
  total_profit: number;
  total_units: number;
  avg_margin: number;
}

export interface SalesByRegion {
  region: string;
  revenue: number;
  profit: number;
  units: number;
}

export interface SalesByProduct {
  product_name: string;
  revenue: number;
  profit: number;
  units: number;
}

export interface SalesByRetailer {
  retailer_name: string;
  revenue: number;
  profit: number;
  units: number;
}

export interface MonthlyTrend {
  year: number;
  month: number;
  revenue: number;
  profit: number;
  units: number;
}

export interface SalesByMethod {
  sales_method: string;
  revenue: number;
  units: number;
  transactions: number;
}

export interface TopCity {
  city: string;
  state: string;
  region: string;
  revenue: number;
  profit: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchKPIs = () => api.get<KPIStore>('/kpis').then(res => res.data);
export const fetchSalesByRegion = () => api.get<SalesByRegion[]>('/sales/by-region').then(res => res.data);
export const fetchSalesByProduct = () => api.get<SalesByProduct[]>('/sales/by-product').then(res => res.data);
export const fetchSalesByRetailer = () => api.get<SalesByRetailer[]>('/sales/by-retailer').then(res => res.data);
export const fetchMonthlyTrend = () => api.get<MonthlyTrend[]>('/sales/monthly-trend').then(res => res.data);
export const fetchSalesByMethod = () => api.get<SalesByMethod[]>('/sales/by-method').then(res => res.data);
export const fetchTopCities = (limit = 10) => api.get<TopCity[]>(`/sales/top-cities?limit=${limit}`).then(res => res.data);
