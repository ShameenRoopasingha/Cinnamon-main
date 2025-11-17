"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import axios from "axios";
export default function VendorProductsPage() {
  const params = useParams();
  const vendorId = params.vendorId;

  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const categories = [
    "All",
    "Cinnamon Sticks",
    "Cinnamon Powder",
    "Cinnamon Oil",
    "Cinnamon Tea",
    "Other",
  ];
  useEffect(() => {
    if (vendorId) {
      fetchVendorAndProducts();
    }
  }, [vendorId]);
  const fetchVendorAndProducts = async () => {
    try {
      setLoading(true);

      // Fetch vendor details
      const vendorResponse = await axios.get(`/api/users?role=vendor`);
      if (vendorResponse.data.success) {
        const foundVendor = vendorResponse.data.data.find(
          (v) => v._id === vendorId
        );
        if (foundVendor) {
          setVendor(foundVendor);
        }
      }
      // Fetch vendor's products
      const productsResponse = await axios.get(
        `/api/products?vendor=${vendorId}&status=active`
      );
      if (productsResponse.data.success) {
        setProducts(productsResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching vendor and products:", error);
    } finally {
      setLoading(false);
    }
  };
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Vendor Header Section */}
        {vendor && (
          <section className="bg-gradient-to-r from-brown-600 to-brown-800 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white flex-shrink-0">
                  {vendor.profileImage ? (
                    <img
                      src={vendor.profileImage}
                      alt={vendor.businessName || vendor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brown-600 text-3xl font-bold">
                      {(vendor.businessName || vendor.name).charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 font-heading">
                    {vendor.businessName || vendor.name}
                  </h1>
                  <p className="text-brown-100 mb-2">
                    {vendor.description || "Premium Ceylon Cinnamon Supplier"}
                  </p>
                  <div className="flex gap-4 text-sm">
                    {vendor.email && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {vendor.email}
                      </span>
                    )}
                    {vendor.phone && (
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {vendor.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-start mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center text-brown-600 hover:text-brown-800 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Vendors
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-bold mb-4 font-heading">Filters</h3>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
                  />
                </div>
                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? "bg-brown-100 text-brown-800 font-medium"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSearchQuery("");
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </aside>
            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length}{" "}
                  products
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No products found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {products.length === 0
                      ? "This vendor has not added any products yet."
                      : "Try adjusting your filters or search terms."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-64 bg-gray-200">
                        {product.images && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg
                              className="w-16 h-16 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-brown-600 text-white text-xs px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>

                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading truncate">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-2xl font-bold text-brown-600">
                            Rs {product.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.stock} {product.unit} available
                          </span>
                        </div>
                        {product.specifications?.origin && (
                          <p className="text-xs text-gray-500 mb-3">
                            Origin: {product.specifications.origin}
                          </p>
                        )}
                        {product.specifications?.grade && (
                          <p className="text-xs text-gray-500 mb-3">
                            Grade: {product.specifications.grade}
                          </p>
                        )}
                        {product.rating?.average > 0 && (
                          <div className="flex items-center text-sm">
                            <svg
                              className="w-4 h-4 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                            <span className="ml-1 text-gray-600">
                              {product.rating.average.toFixed(1)}
                            </span>
                            <span className="ml-1 text-gray-500">
                              ({product.rating.count} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2025 SL Cinnamon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
