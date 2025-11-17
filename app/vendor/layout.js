'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/AuthContext'
import { useEffect } from 'react'

export default function VendorLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { currentUser, logout, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== 'vendor')) {
      router.push('/login')
    }
  }, [currentUser, loading, router])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-600"></div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'vendor') {
    return null
  }

  const navigation = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Products', href: '/vendor/products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Add Product', href: '/vendor/add-product', icon: 'M12 4v16m8-8H4' },
  ]

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-semibold text-brown-900 font-heading">Vendor Portal</div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Welcome, {currentUser.businessName || currentUser.name || 'Vendor'}!
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-brown-700 hover:text-brown-800 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md min-h-screen pt-6">
          <nav className="mt-5 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActive
                      ? 'bg-brown-100 text-brown-800'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg 
                    className={`mr-3 h-6 w-6 ${isActive ? 'text-brown-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
