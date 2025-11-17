'use client'

import { useState } from "react"
import Link from "next/link"
import { LogIn, UserPlus } from "lucide-react"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold font-heading">Cinomna</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 items-center">
            <li><Link href="/" className="hover:text-primary-200 transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-primary-200 transition-colors">Shop</Link></li>
            <li>
              <Link href="/login" className="btn btn-outline bg-white text-primary-600 hover:bg-primary-50 flex items-center gap-2" title="Login">
                <LogIn size={20} />
              </Link>
            </li>
            <li>
              <Link href="/register" className="btn btn-secondary flex items-center gap-2" title="Register">
                <UserPlus size={20} />
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="flex flex-col space-y-4">
              <li><Link href="/" className="block hover:text-primary-200 transition-colors">Home</Link></li>
              <li><Link href="/products" className="block hover:text-primary-200 transition-colors">Products</Link></li>
              <li><Link href="/shop" className="block hover:text-primary-200 transition-colors">Shops</Link></li>
              <li className="pt-2">
                <Link href="/login" className="block btn btn-outline bg-white text-primary-600 hover:bg-primary-50 text-center flex items-center justify-center gap-2" title="Login">
                  <LogIn size={20} />
                </Link>
              </li>
              <li>
                <Link href="/register" className="block btn btn-secondary text-center flex items-center justify-center gap-2" title="Register">
                  <UserPlus size={20} />
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;