import api from './api';

const vendorService = {
  /**
   * Get all vendors
   * @returns {Promise} Promise with vendors data
   */
  getAllVendors: async () => {
    try {
      const response = await api.get('/vendors');
      console.log('API response for vendors:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  /**
   * Get vendor by ID
   * @param {string} id - Vendor ID
   * @returns {Promise} Promise with vendor data
   */
  getVendorById: async (id) => {
    try {
      const response = await api.get(`/vendors/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching vendor ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get products by vendor ID
   * @param {string} vendorId - Vendor ID
   * @returns {Promise} Promise with vendor's products
   */
  getProductsByVendor: async (vendorId) => {
    try {
      const response = await api.get(`/products/vendor/${vendorId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching products for vendor ${vendorId}:`, error);
      throw error;
    }
  },
};

export default vendorService;