import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import networkService from '../services/networkService';

function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-amber-800">{item.label}</Link>
          ) : (
            <span className="text-amber-800 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SocialButton({ children, label }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-sm hover:shadow-sm bg-white"
      aria-label={label}
    >
      {children}
      <span className="text-sm text-gray-700">{label}</span>
    </button>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: null, text: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();

  useEffect(() => {
    // Check if there's a message from registration success
    if (location.state?.message) {
      setStatusMessage({ 
        type: 'success', 
        text: location.state.message 
      });
      
      // Set email from registration if available
      if (location.state.email) {
        setEmail(location.state.email);
      }
      
      // Clear location state after reading
      window.history.replaceState({}, document.title);
    }
    
    // Setup network status listener
    const unsubscribe = networkService.subscribeToNetworkChanges((online) => {
      setIsOnline(online);
      if (online && isNetworkError) {
        // When connection is restored, clear network error
        setStatusMessage({ 
          type: 'success', 
          text: 'Network connection restored. You can now try to login again.' 
        });
        setIsNetworkError(false);
      }
    });
    
    // Cleanup subscriber
    return () => unsubscribe();
  }, [location, isNetworkError]);

  const checkConnection = async () => {
    // First check if browser is online
    if (!navigator.onLine) {
      setStatusMessage({
        type: 'error',
        text: 'You are currently offline. Please check your network connection and try again.'
      });
      setIsNetworkError(true);
      return false;
    }

    // Check server connectivity
    try {
      const isServerReachable = await networkService.isServerReachable(
        import.meta.env.VITE_API_URL || '/api'
      );
      
      if (!isServerReachable) {
        setStatusMessage({
          type: 'error',
          text: 'Unable to connect to the server. The server might be down or unreachable.'
        });
        setIsNetworkError(true);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking connection:', error);
      return false;
    }
  };

  const retryConnection = async () => {
    setStatusMessage({
      type: 'info',
      text: 'Checking connection...'
    });
    
    const isConnected = await checkConnection();
    if (isConnected) {
      setStatusMessage({
        type: 'success',
        text: 'Connection restored! You can now try to login again.'
      });
      setIsNetworkError(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    // Check network status before attempting login
    if (!navigator.onLine) {
      setStatusMessage({
        type: 'error',
        text: 'You are offline. Please check your network connection and try again.'
      });
      setIsNetworkError(true);
      return;
    }
    
    try {
      // Clear any previous messages
      setStatusMessage({ type: null, text: null });
      setIsLoading(true);
      
      // Call authentication service through context
      const response = await login({ email, password });
      
      if (response.success) {
        setStatusMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...'
        });
        
        // Redirect based on user role
        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('user'));
          const role = user?.role;
          
          if (role === 'vendor') {
            navigate('/vendor/dashboard');
          } else if (role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            // Default to customer dashboard
            navigate('/customer/dashboard');
          }
        }, 1500);
      } else if (response.isNetworkError) {
        setIsNetworkError(true);
        setStatusMessage({ 
          type: 'error', 
          text: response.error || 'Network error. Please check your connection or try again later.'
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      setIsLoading(false);
      // Check if it's a network error
      if (error.isNetworkError || (error.message && error.message.includes('Network error'))) {
        setIsNetworkError(true);
        setStatusMessage({ 
          type: 'error', 
          text: 'Network error. Please check your connection or try again later.'
        });
      } else {
        setStatusMessage({ 
          type: 'error', 
          text: error.message || 'Login failed. Please check your credentials.'
        });
      }
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Top header */}
      <header className="bg-amber-50 border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-semibold text-amber-900">Cinnamon</div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:inline-flex items-center gap-2 border rounded-md px-3 py-1 bg-white shadow-sm">
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                <path d="M15 11a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 21a10 10 0 0120 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm text-gray-600">Login</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Login" }]} />

        <div className="mt-6">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left promo column */}
              <div
                className="p-10 sm:p-12 flex flex-col justify-center gap-6 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(116,40,5,1) 0%, rgba(169,85,15,1) 50%, rgba(245,158,11,1) 100%)",
                }}
              >
                <div className="max-w-md">
                  <h2 className="text-3xl font-extrabold mb-3">Welcome Back!</h2>
                  <p className="text-sm opacity-90 leading-relaxed">
                    Log in to access your account, track orders, and discover amazing cinnamon deals from our verified vendors.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M12 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 7h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold">Shop Securely</div>
                        <div className="text-xs opacity-90">With our trusted payment methods</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold">Track Orders</div>
                        <div className="text-xs opacity-90">Monitor your orders in real-time</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold">Exclusive Deals</div>
                        <div className="text-xs opacity-90">Access member-only promotions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* decorative or logo area at bottom */}
                <div className="mt-auto opacity-90 text-sm">Cinnamon Market • Authentic Ceylon Spices</div>
              </div>

              {/* Right sign-in form */}
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-amber-800">Sign In</h3>
                  <div className={`flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-xs font-medium">{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Enter your credentials to access your account</p>

                {statusMessage.type === 'success' && (
                  <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {statusMessage.text}
                  </div>
                )}
                
                {statusMessage.type === 'error' && (
                  <div className="mt-4 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {statusMessage.text}
                    {isNetworkError && (
                      <button 
                        onClick={retryConnection} 
                        className="ml-2 underline font-medium hover:text-red-800 focus:outline-none"
                        type="button"
                      >
                        Retry Connection
                      </button>
                    )}
                  </div>
                )}
                
                {statusMessage.type === 'info' && (
                  <div className="mt-4 bg-blue-50 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    {statusMessage.text}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SocialButton label="Google">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M21 12.3c0-.6-.1-1.2-.2-1.8H12v3.4h5.4c-.2 1.2-.9 2.3-1.8 3.1v2.6h3c1.8-1.6 2.8-4.2 2.8-7.3z" fill="#4285F4"/><path d="M12 22c2.7 0 5-0.9 6.7-2.4l-3-2.6c-0.9 0.6-2.1 1-3.7 1-2.9 0-5.3-1.9-6.1-4.5H3v2.8C4.7 19.7 8 22 12 22z" fill="#34A853"/><path d="M5.9 13.5A6.9 6.9 0 0 1 5.6 12c0-.5 0.1-1 0.2-1.5V7.7H3.1A10 10 0 0 0 2 12c0 1.5.3 2.9.9 4.2l2.9-2.7z" fill="#FBBC05"/><path d="M12 6.5c1.5 0 2.8.5 3.8 1.4l2.8-2.8C17 3.7 14.7 2.8 12 2.8 8 2.8 4.7 5.1 3.1 8.7l2.9 2.8C6.7 8.4 9.1 6.5 12 6.5z" fill="#EA4335"/></svg>
                  </SocialButton>

                  <SocialButton label="Facebook">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3.2l.8-4H14V7a1 1 0 011-1h3V2z" fill="#1877F2"/></svg>
                  </SocialButton>
                </div>

                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 border-t border-gray-200" />
                  <div className="text-xs text-gray-400">OR</div>
                  <div className="flex-1 border-t border-gray-200" />
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <label className="block text-sm">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Email Address</span>
                      {/* add forgot link on right if needed */}
                    </div>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="mt-2 input"
                    />
                  </label>

                  <label className="block text-sm">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Password</span>
                      <Link to="#" className="text-sm text-amber-600">Forgot Password?</Link>
                    </div>
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-2 input"
                    />
                  </label>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4" />
                      <span>Remember me</span>
                    </label>
                  </div>

                  <button 
                    type="submit" 
                    className={`mt-1 w-full btn py-2 rounded-lg ${isNetworkError ? 'bg-gray-500 hover:bg-gray-600' : 'btn-primary'}`}
                    disabled={isLoading || isNetworkError}
                  >
                    {isLoading ? 'Signing in...' : isNetworkError ? 'Network Error - Check Connection' : 'Log In'}
                  </button>
                </form>

                <div className="text-center text-sm text-gray-500 mt-5">
                  Don't have an account? <Link to="/register" className="text-amber-700 font-medium">Sign Up</Link>
                </div>

                <div className="text-xs text-gray-400 text-center mt-4">
                  By logging in, you agree to our <Link to="#" className="underline">Terms</Link> & <Link to="#" className="underline">Privacy</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
