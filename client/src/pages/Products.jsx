import React, { useEffect, useState } from 'react';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    alert(`Add ${product.name} to cart`);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} onAdd={addToCart} />
      ))}
    </div>
  );
};

export default Products;
