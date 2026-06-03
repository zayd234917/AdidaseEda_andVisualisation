import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Package, 
  TrendingUp,
  Settings,
  BarChart3
} from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BarChart3 size={32} className="text-primary" />
        <span>Adidas BI</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        
        <NavLink to="/regions" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Map size={20} />
          <span>Regions</span>
        </NavLink>
        
        <NavLink to="/products" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        
        <NavLink to="/trends" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <TrendingUp size={20} />
          <span>Trends</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <button className="nav-item border-none bg-transparent cursor-pointer w-full text-left">
          <Settings size={20} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
