import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data.slice(0, 4)));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Best Sellers</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} onAdd={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default Home;
