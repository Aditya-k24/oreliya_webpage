import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './pages/Products.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import About from './pages/About.jsx';
import Deals from './pages/Deals.jsx';

const App = () => {
  return (
    <div className="p-4">
      <nav className="mb-4 space-x-4">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/deals">Deals</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
