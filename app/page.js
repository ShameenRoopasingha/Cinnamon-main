"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import VendorCard from "@/components/VendorCard";
import Link from "next/link";
import vendorService from "@/lib/services/vendorService";
import CinnamonHero from "@/components/hero";
export default function Homepage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);

        // Try fetching from MongoDB API first
        const response = await fetch("/api/users?role=vendor");
        const data = await response.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Map MongoDB user data to vendor format
          const mappedVendors = data.data.map((user) => ({
            _id: user._id,
            id: user._id,
            name: user.businessName || user.name,
            category: "Cinnamon",
            logo:
              user.profileImage ||
              "https://via.placeholder.com/300x300?text=" +
                (user.businessName || user.name),
            profileImage: user.profileImage,
            image: user.profileImage,
            rating: 4.5,
            productCount: 0,
            email: user.email,
          }));
          setVendors(mappedVendors);
        } else {
          // Fallback to old API or sample data
          try {
            const oldApiResponse = await vendorService.getAllVendors();
            if (Array.isArray(oldApiResponse)) {
              setVendors(oldApiResponse);
            } else if (oldApiResponse && Array.isArray(oldApiResponse.data)) {
              setVendors(oldApiResponse.data);
            } else {
              console.log("No vendors found, using sample data");
              setVendors(featuredVendors);
            }
          } catch (oldApiErr) {
            console.log("Old API also failed, using sample data");
            setVendors(featuredVendors);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to load vendors");
        setLoading(false);
        setVendors(featuredVendors);
      }
    };

    fetchVendors();
  }, []);
  const featuredVendors = [
    {
      id: 1,
      name: "ElectroTech",
      category: "Electronics",
      image: "https://via.placeholder.com/300x300?text=ElectroTech",
      rating: 4.8,
      productCount: 42,
    },
    {
      id: 2,
      name: "FashionHub",
      category: "Clothing",
      image: "https://via.placeholder.com/300x300?text=FashionHub",
      rating: 4.7,
      productCount: 128,
    },
    {
      id: 3,
      name: "HomeDecor",
      category: "Home Goods",
      image: "https://via.placeholder.com/300x300?text=HomeDecor",
      rating: 4.9,
      productCount: 56,
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <CinnamonHero />

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Link
                href="/shop"
                className="inline-block bg-brown-600 text-white px-8 py-4 rounded-lg hover:bg-brown-700 transition-colors text-lg font-semibold"
              >
                🛒 Browse All Products
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">
                  Quality Products
                </h3>
                <p className="text-gray-600">
                  All products on our platform are verified for quality and
                  authenticity.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">
                  Competitive Pricing
                </h3>
                <p className="text-gray-600">
                  We ensure you get the best value for your money with our
                  price-match guarantee.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="bg-primary-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 font-heading">
                  Fast Delivery
                </h3>
                <p className="text-gray-600">
                  Enjoy quick and reliable shipping options to get your products
                  delivered on time.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold font-heading text-gray-800">
                Our Vendors
              </h2>
              <Link
                href="/vendors"
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
              >
                View All
                <svg
                  className="w-5 h-5 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="text-center p-8 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {vendors.length === 0 ? (
                  <p className="col-span-full text-center text-gray-500 py-8">
                    No vendors found
                  </p>
                ) : (
                  vendors.map((vendor) => (
                    <VendorCard key={vendor._id || vendor.id} vendor={vendor} />
                  ))
                )}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-secondary-600 to-secondary-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 font-heading">
              Become a Vendor Today
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join our growing marketplace and reach thousands of potential
              customers. Start selling your products with us today!
            </p>
            <Link
              href="/register"
              className="btn btn-outline bg-white text-secondary-700 hover:bg-secondary-50 px-8 py-3 rounded-full text-lg inline-block"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-heading">Cinomna</h3>
              <p className="text-gray-400 mb-4">
                Your trusted marketplace for quality products from verified
                vendors.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 hover:bg-primary-600 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 font-heading">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 font-heading">
                Categories
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Electronics
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Fashion
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home & Garden
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Toys & Games
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4 font-heading">
                Newsletter
              </h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get updates on our latest products and special
                offers.
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none text-gray-800"
                />
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 Cinomna. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
