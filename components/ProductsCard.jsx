import React from 'react';
import { Link } from 'react-router-dom';

function ProductsCard({ product }) {
  // Default product if not provided
  const defaultProduct = {
    id: 1,
    name: 'Product Name',
    price: 99.99,
    image: '/placeholder.jpg',
    rating: 4.5,
    vendor: 'Vendor Name',
    category: 'Category'
  };

  const p = product || defaultProduct;

  return (
    <div className="card group">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <div className="aspect-w-1 aspect-h-1 bg-gray-200 w-full rounded-lg overflow-hidden">
          <img 
            src={p.image} 
            alt={p.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        <div className="absolute top-2 right-2">
          <button className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      <Link to={`/products/${p.id}`} className="block group-hover:text-primary-600 transition-colors">
        <h3 className="font-medium text-lg">{p.name}</h3>
      </Link>

      <div className="flex justify-between items-center mt-1">
        <p className="font-bold text-lg text-primary-700">${p.price.toFixed(2)}</p>
        <div className="flex items-center text-sm text-yellow-500">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          {p.rating}
        </div>
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="text-xs text-gray-500">{p.vendor}</span>
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{p.category}</span>
      </div>
    </div>
  );
}

export default ProductsCard;
