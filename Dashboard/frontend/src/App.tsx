import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Overview from './pages/Overview';
import Regions from './pages/Regions';
import Products from './pages/Products';
import Trends from './pages/Trends';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Overview />} />
          <Route path="regions" element={<Regions />} />
          <Route path="products" element={<Products />} />
          <Route path="trends" element={<Trends />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
