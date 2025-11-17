'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const user = authService.getCurrentUser()
      if (user) {
        setCurrentUser(user)
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    const response = await authService.login(credentials)
    if (response.success) {
      setCurrentUser(authService.getCurrentUser())
      setIsAuthenticated(true)
    }
    return response
  }

  const logout = () => {
    authService.logout()
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const register = async (userData, type) => {
    try {
      let response
      
      if (type === 'customer') {
        response = await authService.registerCustomer(userData)
      } else if (type === 'vendor') {
        response = await authService.registerVendor(userData)
      } else {
        throw new Error('Invalid account type')
      }
      
      return { success: true, data: response }
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      }
    }
  }

  const updateUser = (updatedData) => {
    const updatedUser = { ...currentUser, ...updatedData }
    setCurrentUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    register,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
