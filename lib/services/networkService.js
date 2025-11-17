/**
 * Network Service for monitoring and handling network connectivity
 */

// Network status event listeners
const listeners = [];
let isOnline = navigator.onLine;

// Function to notify all listeners about network status changes
const notifyListeners = (online) => {
  listeners.forEach(listener => listener(online));
};

// Setup event listeners for online/offline events
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    isOnline = true;
    notifyListeners(true);
    console.log('Network connection restored');
  });
  
  window.addEventListener('offline', () => {
    isOnline = false;
    notifyListeners(false);
    console.log('Network connection lost');
  });
}

// Check if the server is reachable by making a small HEAD request
const checkServerReachable = async (url) => {
  if (!isOnline) return false;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error('Server unreachable:', error);
    return false;
  }
};

// Extract base API URL from full URL
const getBaseUrl = (apiUrl) => {
  try {
    const url = new URL(apiUrl);
    return `${url.protocol}//${url.host}`;
  } catch (error) {
    console.error('Invalid API URL:', error);
    return '';
  }
};

const networkService = {
  /**
   * Check if the device is currently online
   * @returns {boolean} Online status
   */
  isOnline: () => isOnline,
  
  /**
   * Check if the API server is reachable
   * @param {string} apiUrl - API URL to check
   * @returns {Promise<boolean>} Server reachability
   */
  isServerReachable: async (apiUrl) => {
    const baseUrl = getBaseUrl(apiUrl);
    return baseUrl ? await checkServerReachable(baseUrl) : false;
  },
  
  /**
   * Subscribe to network status changes
   * @param {Function} listener - Callback function that receives online status
   * @returns {Function} Unsubscribe function
   */
  subscribeToNetworkChanges: (listener) => {
    if (typeof listener === 'function') {
      listeners.push(listener);
      
      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
      };
    }
    return () => {};
  }
};

export default networkService;