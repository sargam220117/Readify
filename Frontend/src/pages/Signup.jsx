import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const UserSignup = () => {
  const [userType, setUserType] = useState(null); // 'admin' or 'customer' or null
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Admin specific fields
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [businessLicense, setBusinessLicense] = useState('');
  
  const [adminDetailsVerified, setAdminDetailsVerified] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleVerifyAdminDetails = () => {
    setError('');
    
    if (!shopName.trim()) {
      setError('Please enter shop name');
      return;
    }
    if (!location.trim()) {
      setError('Please enter location');
      return;
    }
    if (!shopCategory) {
      setError('Please select shop category');
      return;
    }
    if (!businessLicense.trim()) {
      setError('Please enter business license number');
      return;
    }
    
    // Dummy verification - just mark as verified
    setAdminDetailsVerified(true);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    if (userType === 'admin' && !adminDetailsVerified) {
      return setError('Please verify your admin details first');
    }

    setLoading(true);

    const result = await register(username, email, password, userType);

    if (result.success) {
      navigate(userType === 'admin' ? '/admin' : '/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  // Show user type selection
  if (userType === null) {
    return (
      <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
        <div className="w-full max-w-md px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
              Join Readify<span className="text-amber-600">.</span>
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium text-lg transition-colors">
              Are you a buyer or a book seller?
            </p>
          </div>

          <div className="space-y-4">
            {/* Customer Option */}
            <button
              onClick={() => setUserType('customer')}
              className="w-full p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">👤</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    I'm a Customer
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Browse and buy books from our collection
                  </p>
                </div>
              </div>
            </button>

            {/* Admin Option */}
            <button
              onClick={() => setUserType('admin')}
              className="w-full p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-300 text-left group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">🏪</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                    I'm a Book Seller
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage your bookstore and inventory
                  </p>
                </div>
              </div>
            </button>
          </div>

          <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300 min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <button
            onClick={() => setUserType(null)}
            className="text-amber-600 hover:text-amber-700 font-semibold text-sm mb-4 transition-colors"
          >
            ← Change Account Type
          </button>
          <h2 className="text-4xl font-extrabold text-[#1a1a1a] dark:text-white tracking-tight transition-colors">
            {userType === 'admin' ? 'Register Your Store' : 'Create Your Account'}<span className="text-amber-600">.</span>
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium text-lg transition-colors">
            {userType === 'admin' ? 'Become a book seller on Readify' : 'Start shopping for books'}
          </p>
        </div>

        <div className="bg-[#f7f3ec] dark:bg-gray-800 py-10 px-6 shadow-sm rounded-2xl sm:px-10 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <form className="space-y-6" onSubmit={handleSignup}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 flex gap-3 items-start transition-colors">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Admin Details Section */}
            {userType === 'admin' && (
              <div className="space-y-6 pb-6 border-b border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">📋 Store Information</h3>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    disabled={adminDetailsVerified}
                    className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., Classic Books Store"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={adminDetailsVerified}
                    className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., New York, NY"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Shop Category
                  </label>
                  <select
                    value={shopCategory}
                    onChange={(e) => setShopCategory(e.target.value)}
                    disabled={adminDetailsVerified}
                    className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Category</option>
                    <option value="fiction">Fiction</option>
                    <option value="academic">Academic</option>
                    <option value="childrens">Children's Books</option>
                    <option value="technical">Technical</option>
                    <option value="biography">Biography</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                    Business License Number
                  </label>
                  <input
                    type="text"
                    value={businessLicense}
                    onChange={(e) => setBusinessLicense(e.target.value)}
                    disabled={adminDetailsVerified}
                    className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., BL-2024-001234"
                  />
                </div>

                {!adminDetailsVerified ? (
                  <button
                    type="button"
                    onClick={handleVerifyAdminDetails}
                    className="w-full py-3 px-4 border border-amber-600 rounded-lg text-amber-600 font-bold hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  >
                    ✓ Verify Store Details
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 border-2 border-green-500 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center gap-3 justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-600 dark:text-green-400 font-bold">Store details verified!</span>
                  </div>
                )}
              </div>
            )}

            {/* Personal Details Section */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">👤 Personal Information</h3>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors"
                placeholder="your_username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors"
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Min. 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 transition-colors">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium text-gray-900 dark:text-white transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || (userType === 'admin' && !adminDetailsVerified)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : userType === 'admin' ? 'Register Store' : 'Sign up'}
            </button>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium transition-colors">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-bold transition-colors">
                  Sign in
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
