import React from 'react';

const ProductCard = ({ product, onAdd }) => {
  return (
    <div className="border rounded p-2 text-center">
      <img src={product.images[0]} alt={product.name} className="h-32 w-full object-cover" />
      <h3 className="font-semibold mt-2">{product.name}</h3>
      <p className="text-sm">${product.price}</p>
      <button onClick={() => onAdd(product)} className="mt-2 bg-blue-500 text-white px-2 py-1 rounded">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
