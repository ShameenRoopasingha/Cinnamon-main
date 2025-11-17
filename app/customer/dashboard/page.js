"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import axios from "axios";
export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalVendors: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchDashboardData();
  }, []);
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch vendors count
      const vendorsResponse = await axios.get(`/api/users?role=vendor`);

      // Fetch products count
      const productsResponse = await axios.get(`/api/products?status=active`);

      setStats({
        totalOrders: 0, // TODO: Implement orders
        pendingOrders: 0,
        totalVendors: vendorsResponse.data.success
          ? vendorsResponse.data.count
          : 0,
        totalProducts: productsResponse.data.success
          ? productsResponse.data.data.length
          : 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-heading">
          Customer Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}!</p>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalOrders}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Orders
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.pendingOrders}
                  </p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Vendors
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalVendors}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Available Products
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats.totalProducts}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/shop"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="bg-brown-100 rounded-lg p-2">
                    <svg
                      className="w-6 h-6 text-brown-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Browse Vendors</p>
                    <p className="text-sm text-gray-600">
                      Explore Ceylon cinnamon vendors
                    </p>
                  </div>
                </Link>
                <Link
                  href="/customer/orders"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  <div className="bg-blue-100 rounded-lg p-2">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">View Orders</p>
                    <p className="text-sm text-gray-600">
                      Track your order history
                    </p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">
                About Ceylon Cinnamon
              </h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  Ceylon Cinnamon, also known as "true cinnamon," is native to
                  Sri Lanka and is prized for its delicate, sweet flavor and
                  numerous health benefits.
                </p>
                <p>
                  Our marketplace connects you directly with trusted Sri Lankan
                  vendors, ensuring you receive authentic, high-quality Ceylon
                  cinnamon products.
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Popular Categories:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-brown-100 text-brown-700 rounded-full text-xs">
                      Cinnamon Sticks
                    </span>
                    <span className="px-3 py-1 bg-brown-100 text-brown-700 rounded-full text-xs">
                      Cinnamon Powder
                    </span>
                    <span className="px-3 py-1 bg-brown-100 text-brown-700 rounded-full text-xs">
                      Cinnamon Oil
                    </span>
                    <span className="px-3 py-1 bg-brown-100 text-brown-700 rounded-full text-xs">
                      Cinnamon Tea
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
