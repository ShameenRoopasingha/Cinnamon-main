'use client'

import Link from 'next/link'

function VendorCard({ vendor }) {
  // Default vendor if not provided
  const defaultVendor = {
    _id: 1,
    name: 'Vendor Name',
    category: 'Category',
    logo: 'https://via.placeholder.com/300x300?text=Vendor',
    rating: 4.7,
    productCount: 24
  };

  console.log('Vendor prop in VendorCard:', vendor); // Debug the vendor prop

  const v = vendor || defaultVendor;
  const vendorId = v._id || v.id;
  const vendorImage = v.logo || v.profileImage || v.image;

  return (
    <div className="card group flex flex-col items-center">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
          <img 
            src={vendorImage} 
            alt={v.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
            }}
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-primary-50 border border-primary-200 rounded-full p-1">
          <div className="flex items-center text-xs text-primary-700 font-medium">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            {v.rating}
          </div>
        </div>
      </div>

      <Link href={`/shop/${vendorId}`} className="text-center">
        <h3 className="text-lg font-medium group-hover:text-primary-600 transition-colors">{v.name}</h3>
      </Link>
      
      <p className="text-gray-600 text-sm">{v.category}</p>
      
      <div className="mt-3 text-xs text-gray-500">
        {typeof v.productCount !== 'undefined' ? v.productCount : v.products?.length || 0} Products
      </div>
      
      <div className="mt-4 w-full">
        <Link href={`/shop/${vendorId}`} className="block w-full text-center btn btn-outline hover:bg-primary-50 hover:text-primary-600 transition-colors">
          View Shop
        </Link>
      </div>
    </div>
  );
}

export default VendorCard;
