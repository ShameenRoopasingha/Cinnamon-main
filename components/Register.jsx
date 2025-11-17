import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState('');
  const [formData, setFormData] = useState({
    // Step 1 - Account Type
    accountType: '',
    
    // Step 2 - Basic Info
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Step 3 - Additional Info (Customer)
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Step 3 - Additional Info (Vendor)
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessCity: '',
    businessState: '',
    businessZipCode: '',
    taxId: '',
    businessDescription: '',
    
    // Agreement
    agreeToTerms: false,
    agreeToMarketing: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth();
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleAccountTypeSelect = (type) => {
    setAccountType(type);
    setFormData({
      ...formData,
      accountType: type
    });
    
    // Clear account type error if exists
    if (errors.accountType) {
      setErrors({
        ...errors,
        accountType: null
      });
    }
  };
  
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!accountType) {
      newErrors.accountType = 'Please select an account type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3Customer = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep3Vendor = () => {
    const newErrors = {};
    
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.businessEmail) {
      newErrors.businessEmail = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = 'Business email is invalid';
    }
    
    if (!formData.businessPhone) {
      newErrors.businessPhone = 'Business phone is required';
    }
    
    if (!formData.businessAddress) {
      newErrors.businessAddress = 'Business address is required';
    }
    
    if (!formData.businessCity) {
      newErrors.businessCity = 'City is required';
    }
    
    if (!formData.businessZipCode) {
      newErrors.businessZipCode = 'ZIP code is required';
    }
    
    // Country validation removed as requested
    
    if (!formData.taxId) {
      newErrors.taxId = 'Tax ID is required';
    }
    
    if (!formData.businessDescription) {
      newErrors.businessDescription = 'Business description is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let isValid = false;
    
    if (accountType === 'customer') {
      isValid = validateStep3Customer();
    } else if (accountType === 'vendor') {
      isValid = validateStep3Vendor();
    }
    
    if (isValid) {
      setIsLoading(true);
      setRegisterError(null);
      
      try {
        let userData;
        
        if (accountType === 'customer') {
          // Prepare customer data
          userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
              country: formData.country
            },
            marketingConsent: formData.agreeToMarketing
          };
        } else {
          // Prepare vendor data
          userData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            businessName: formData.businessName,
            businessEmail: formData.businessEmail,
            businessPhone: formData.businessPhone,
            businessAddress: {
              street: formData.businessAddress,
              city: formData.businessCity,
              state: formData.businessState,
              zipCode: formData.businessZipCode
            },
            taxId: formData.taxId,
            businessDescription: formData.businessDescription,
            marketingConsent: formData.agreeToMarketing
          };
        }
        
        // Use the register function from AuthContext
        const response = await register(userData, accountType);
        
        if (response.success) {
          setIsLoading(false);
          setRegisterSuccess(true);
          
          if (accountType === 'vendor') {
            // For vendors: Auto-login and redirect to vendor dashboard
            try {
              // Attempt to login with the same credentials
              const loginResponse = await login({ 
                email: formData.email, 
                password: formData.password 
              });
              
              if (loginResponse.success) {
                // Show success message and redirect to vendor dashboard
                setTimeout(() => {
                  navigate('/vendor/dashboard');
                }, 1500);
              } else {
                // If auto-login fails, redirect to login page
                setTimeout(() => {
                  navigate('/login', { 
                    state: { 
                      message: `Registration successful! Please login with your credentials.`,
                      email: formData.email
                    } 
                  });
                }, 1500);
              }
            } catch (loginErr) {
              // If auto-login fails, redirect to login page
              setTimeout(() => {
                navigate('/login', { 
                  state: { 
                    message: `Registration successful! Please login with your credentials.`,
                    email: formData.email
                  } 
                });
              }, 1500);
            }
          } else {
            // For customers: Auto-login and redirect to customer dashboard (mirrors vendor behavior)
            try {
              const loginResponse = await login({
                email: formData.email,
                password: formData.password
              });

              if (loginResponse.success) {
                // Redirect to customer dashboard
                setTimeout(() => {
                  navigate('/customer/dashboard');
                }, 1500);
              } else {
                // If auto-login fails, redirect to login page with helpful message
                setTimeout(() => {
                  navigate('/login', {
                    state: {
                      message: `Registration successful! Please login with your credentials.`,
                      email: formData.email
                    }
                  });
                }, 1500);
              }
            } catch (loginErr) {
              // If auto-login fails unexpectedly, redirect to login page
              setTimeout(() => {
                navigate('/login', {
                  state: {
                    message: `Registration successful! Please login with your credentials.`,
                    email: formData.email
                  }
                });
              }, 1500);
            }
          }
        } else {
          throw new Error(response.error || 'Registration failed. Please try again.');
        }
      } catch (error) {
        setIsLoading(false);
        setRegisterError(error.message || 'Registration failed. Please try again.');
        console.error('Registration error:', error);
      }
    }
  };
  
  // Render account type selection (Step 1)
  const renderStep1 = () => (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Create Your Account</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Choose the type of account you want to create
      </p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div 
          onClick={() => handleAccountTypeSelect('customer')}
          style={{ 
            padding: '30px 20px',
            border: accountType === 'customer' ? '2px solid #ff6b6b' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            backgroundColor: accountType === 'customer' ? '#fff0f0' : 'white',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '15px',
            color: accountType === 'customer' ? '#ff6b6b' : '#666'
          }}>
            👤
          </div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Customer</h3>
          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
            Shop products from various vendors and enjoy personalized recommendations
          </p>
        </div>
        
        <div 
          onClick={() => handleAccountTypeSelect('vendor')}
          style={{ 
            padding: '30px 20px',
            border: accountType === 'vendor' ? '2px solid #ff6b6b' : '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'center',
            backgroundColor: accountType === 'vendor' ? '#fff0f0' : 'white',
            transition: 'all 0.3s'
          }}
        >
          <div style={{ 
            fontSize: '3rem',
            marginBottom: '15px',
            color: accountType === 'vendor' ? '#ff6b6b' : '#666'
          }}>
            🏪
          </div>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>Vendor</h3>
          <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
            Sell your products and reach a wider audience through our marketplace
          </p>
        </div>
      </div>
      
      {errors.accountType && (
        <p style={{ color: '#dc3545', fontSize: '0.9rem', textAlign: 'center', marginBottom: '20px' }}>
          {errors.accountType}
        </p>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleNextStep}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff5252'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
        >
          Continue
        </button>
      </div>
    </div>
  );
  
  // Rest of component remains the same...
  // Render basic information form (Step 2)
  const renderStep2 = () => (
    <div>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Basic Information</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Please provide your personal details
      </p>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="firstName"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="John"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.firstName ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.firstName && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.firstName}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="lastName"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Doe"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.lastName ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.lastName && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.lastName}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor="email"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.email && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.email}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor="password"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Password *
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.password && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.password}
          </p>
        )}
        <p style={{ color: '#666', fontSize: '0.85rem', margin: '5px 0 0' }}>
          Password must be at least 8 characters long
        </p>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label 
          htmlFor="confirmPassword"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Confirm Password *
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.confirmPassword && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.confirmPassword}
          </p>
        )}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={handlePrevStep}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8f9fa',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        
        <button
          onClick={handleNextStep}
          style={{
            padding: '12px 24px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff5252'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
        >
          Continue
        </button>
      </div>
    </div>
  );
  
  // Render customer additional information form (Step 3)
  const renderStep3Customer = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Customer Information</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Almost done! Just a few more details to complete your account
      </p>
      
      {registerError && (
        <div style={{ 
          backgroundColor: '#ffe5e5', 
          color: '#d63031', 
          padding: '12px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          fontSize: '0.95rem'
        }}>
          {registerError}
        </div>
      )}
      
      {registerSuccess && (
        <div style={{ 
          backgroundColor: '#e3fcef', 
          color: '#00b894', 
          padding: '12px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          fontSize: '0.95rem'
        }}>
          Registration successful! Redirecting to login page...
        </div>
      )}
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="phoneNumber"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Phone Number *
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="+1 123-456-7890"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.phoneNumber ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.phoneNumber && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.phoneNumber}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="dateOfBirth"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.dateOfBirth ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.dateOfBirth && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.dateOfBirth}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor="address"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Address *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="123 Main St"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.address ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.address && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.address}
          </p>
        )}
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="city"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            City *
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="New York"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.city ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.city && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.city}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="state"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            State/Province
          </label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="NY"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.state ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.state && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.state}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div>
          <label 
            htmlFor="zipCode"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            ZIP/Postal Code *
          </label>
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            placeholder="10001"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.zipCode ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.zipCode && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.zipCode}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="country"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Country *
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.country ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px',
              backgroundColor: 'white'
            }}
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="Other">Other</option>
          </select>
          {errors.country && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.country}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '0.95rem' }}>
            I agree to the <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Terms of Service</a> and <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Privacy Policy</a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0 25px' }}>
            {errors.agreeToTerms}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agreeToMarketing"
            checked={formData.agreeToMarketing}
            onChange={handleInputChange}
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '0.95rem' }}>
            I want to receive promotional emails about products, services, and events
          </span>
        </label>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8f9fa',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '14px 24px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'background-color 0.3s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#ff5252')}
          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#ff6b6b')}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </div>
    </form>
  );
  
  // Render vendor additional information form (Step 3)
  const renderStep3Vendor = () => (
    <form onSubmit={handleSubmit}>
      <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', textAlign: 'center' }}>Vendor Information</h2>
      <p style={{ color: '#666', marginBottom: '30px', textAlign: 'center' }}>
        Tell us about your business to start selling on our marketplace
      </p>
      
      {registerError && (
        <div style={{ 
          backgroundColor: '#ffe5e5', 
          color: '#d63031', 
          padding: '12px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          fontSize: '0.95rem'
        }}>
          {registerError}
        </div>
      )}
      
      {registerSuccess && (
        <div style={{ 
          backgroundColor: '#e3fcef', 
          color: '#00b894', 
          padding: '12px 15px', 
          borderRadius: '4px', 
          marginBottom: '20px',
          fontSize: '0.95rem'
        }}>
          Registration successful! Redirecting to login page...
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor="businessName"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Business Name *
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleInputChange}
          placeholder="Your Company Name"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.businessName ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.businessName && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.businessName}
          </p>
        )}
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="businessEmail"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Business Email *
          </label>
          <input
            type="email"
            id="businessEmail"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={handleInputChange}
            placeholder="business@example.com"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.businessEmail ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.businessEmail && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.businessEmail}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="businessPhone"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Business Phone *
          </label>
          <input
            type="tel"
            id="businessPhone"
            name="businessPhone"
            value={formData.businessPhone}
            onChange={handleInputChange}
            placeholder="+1 123-456-7890"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.businessPhone ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.businessPhone && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.businessPhone}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label 
          htmlFor="businessAddress"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Business Address *
        </label>
        <input
          type="text"
          id="businessAddress"
          name="businessAddress"
          value={formData.businessAddress}
          onChange={handleInputChange}
          placeholder="123 Business St"
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.businessAddress ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px'
          }}
        />
        {errors.businessAddress && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.businessAddress}
          </p>
        )}
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="businessCity"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            City *
          </label>
          <input
            type="text"
            id="businessCity"
            name="businessCity"
            value={formData.businessCity}
            onChange={handleInputChange}
            placeholder="New York"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.businessCity ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.businessCity && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.businessCity}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="businessState"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            State/Province
          </label>
          <input
            type="text"
            id="businessState"
            name="businessState"
            value={formData.businessState}
            onChange={handleInputChange}
            placeholder="NY"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.businessState ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.businessState && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.businessState}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <label 
            htmlFor="businessZipCode"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            ZIP/Postal Code *
          </label>
          <input
            type="text"
            id="businessZipCode"
            name="businessZipCode"
            value={formData.businessZipCode}
            onChange={handleInputChange}
            placeholder="10001"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.businessZipCode ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.businessZipCode && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.businessZipCode}
            </p>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="taxId"
            style={{ 
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500'
            }}
          >
            Tax ID / Business Registration Number *
          </label>
          <input
            type="text"
            id="taxId"
            name="taxId"
            value={formData.taxId}
            onChange={handleInputChange}
            placeholder="Tax ID / Registration Number"
            style={{
              width: '100%',
              padding: '12px 15px',
              borderRadius: '4px',
              border: errors.taxId ? '1px solid #dc3545' : '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          {errors.taxId && (
            <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
              {errors.taxId}
            </p>
          )}
        </div>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label 
          htmlFor="businessDescription"
          style={{ 
            display: 'block',
            marginBottom: '8px',
            fontWeight: '500'
          }}
        >
          Business Description *
        </label>
        <textarea
          id="businessDescription"
          name="businessDescription"
          value={formData.businessDescription}
          onChange={handleInputChange}
          placeholder="Tell us about your business, products, and what makes you unique..."
          rows={4}
          style={{
            width: '100%',
            padding: '12px 15px',
            borderRadius: '4px',
            border: errors.businessDescription ? '1px solid #dc3545' : '1px solid #ddd',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
        {errors.businessDescription && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0' }}>
            {errors.businessDescription}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '0.95rem' }}>
            I agree to the <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Terms of Service</a>, <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Vendor Agreement</a>, and <a href="#" style={{ color: '#ff6b6b', textDecoration: 'none' }}>Privacy Policy</a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p style={{ color: '#dc3545', fontSize: '0.85rem', margin: '5px 0 0 25px' }}>
            {errors.agreeToTerms}
          </p>
        )}
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            name="agreeToMarketing"
            checked={formData.agreeToMarketing}
            onChange={handleInputChange}
            style={{ marginRight: '10px' }}
          />
          <span style={{ fontSize: '0.95rem' }}>
            I want to receive promotional emails about selling opportunities and marketplace updates
          </span>
        </label>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          type="button"
          onClick={handlePrevStep}
          style={{
            padding: '12px 24px',
            backgroundColor: '#f8f9fa',
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Back
        </button>
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '14px 24px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.7 : 1,
            transition: 'background-color 0.3s',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
          onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#ff5252')}
          onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = '#ff6b6b')}
        >
          {isLoading ? 'Creating Account...' : 'Create Vendor Account'}
        </button>
      </div>
    </form>
  );

  return (
    <div style={{ 
      backgroundColor: '#f8f9fa',
      padding: '40px 20px',
      minHeight: 'calc(100vh - 200px)' // Adjust based on your header/footer
    }}>
      <div style={{ 
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Progress Indicator */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              height: '2px',
              backgroundColor: '#ddd',
              transform: 'translateY(-50%)',
              zIndex: 1
            }}></div>
            
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              height: '2px',
              backgroundColor: '#ff6b6b',
              transform: 'translateY(-50%)',
              zIndex: 1,
              transition: 'width 0.3s'
            }}></div>
            
            {[1, 2, 3].map(stepNumber => (
              <div 
                key={stepNumber}
                style={{ 
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: stepNumber <= step ? '#ff6b6b' : 'white',
                  border: `2px solid ${stepNumber <= step ? '#ff6b6b' : '#ddd'}`,
                  color: stepNumber <= step ? 'white' : '#666',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  position: 'relative',
                  zIndex: 2
                }}
              >
                {stepNumber}
              </div>
            ))}
          </div>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}>
            <div style={{ 
              width: '40px',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: step >= 1 ? '#333' : '#666'
            }}>
              Type
            </div>
            <div style={{ 
              width: '40px',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: step >= 2 ? '#333' : '#666'
            }}>
              Info
            </div>
            <div style={{ 
              width: '40px',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: step >= 3 ? '#333' : '#666'
            }}>
              Details
            </div>
          </div>
        </div>
        
        {/* Form steps */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && accountType === 'customer' && renderStep3Customer()}
        {step === 3 && accountType === 'vendor' && renderStep3Vendor()}
        
        {/* Sign in link */}
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={{ 
                color: '#ff6b6b',
                textDecoration: 'none',
                fontWeight: '500'
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
