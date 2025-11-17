import api from './api';
import networkService from './networkService';

const authService = {
  /**
   * Register a new customer
   * @param {Object} customerData - Customer registration data
   * @returns {Promise} Promise with registration result
   */
  registerCustomer: async (customerData) => {
    try {
      console.log('Registering customer with data:', customerData);
      
      // Send data directly as received from the form
      const response = await api.post('/customers/register', customerData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registering customer:', error);
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection or try again later.');
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  /**
   * Register a new vendor
   * @param {Object} vendorData - Vendor registration data
   * @returns {Promise} Promise with registration result
   */
  registerVendor: async (vendorData) => {
    try {
      console.log('Registering vendor with data:', vendorData);
      
      // Send data directly as received from the form
      const response = await api.post('/vendors/register', vendorData);
      console.log('Vendor registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error registering vendor:', error);
      // Handle network errors
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your connection or try again later.');
      }
      throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  },

  /**
   * Check network and server connectivity before attempting actions
   * @returns {Promise<{isConnected: boolean, message: string}>} Connection status and message
   */
  checkConnectivity: async () => {
    if (!networkService.isOnline()) {
      return {
        isConnected: false,
        message: 'You are currently offline. Please check your network connection and try again.'
      };
    }
    
    // Check if the server is reachable
    const isServerReachable = await networkService.isServerReachable(api.defaults.baseURL);
    if (!isServerReachable) {
      return {
        isConnected: false,
        message: 'Unable to connect to the server. The server might be down or unreachable. Retry Connection'
      };
    }
    
    return { isConnected: true, message: '' };
  },

  /**
   * Login a user (customer, vendor, or admin)
   * @param {Object} credentials - Login credentials (email, password)
   * @returns {Promise} Promise with login result including token
   */
  login: async (credentials) => {
    try {
      console.log('Attempting login to:', api.defaults.baseURL);
      const response = await api.post('/auth/login', credentials);
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Store user data with role information
        const userData = response.data.user || {};
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, data: response.data };
      } else {
        return { success: false, error: 'Invalid login credentials' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // The api.js interceptor now standardizes network errors.
      if (error.isNetworkError) {
        return { 
          success: false, 
          error: error.message || 'Network error. Please check your connection or try again later.',
          isNetworkError: true
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to login. Please try again.'
      };
    }
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear cookies as well
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  },

  /**
   * Get the current authenticated user
   * @returns {Object|null} User object or null if not authenticated
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  /**
   * Check if a user is authenticated
   * @returns {boolean} True if authenticated, false otherwise
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;