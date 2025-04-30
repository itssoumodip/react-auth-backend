import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = ({ onForgotPassword, switchPage }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:3001/login", 
        { 
          email: formData.email, 
          password: formData.password 
        },
        { 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
      
      console.log("Response Data: ", response.data);
      
      if (response.data.message === "success") {
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/home'); 
        }, 2000)
      }
      else if (response.data.message === "notExists") {
        toast.error('User does not exist. Please sign up.');
        if (switchPage) {
          switchPage();
        } else {
          navigate('/signup');
        }
      } else if (response.data.message === "Password Missmatch") {
        setError('Password mismatch. Please try again.');
        toast.error('Password mismatch. Please try again.');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      toast.error('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 -mx-8 -mt-8 mb-6"></div>
      
      <div className="text-center mb-6">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 mb-4">
          <FiUser className="text-blue-600 text-2xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-500 mt-1">Please enter your details to sign in</p>
      </div>

      {error && (
        <div className="p-3 mb-4 flex items-center gap-2 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          <FiAlertCircle className="text-red-500 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email" className="text-sm font-medium text-gray-700 block mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="login-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="name@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="login-password" className="text-sm font-medium text-gray-700 block mb-1">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10 w-full p-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? 
                <FiEyeOff className="text-gray-400 hover:text-gray-600" /> : 
                <FiEye className="text-gray-400 hover:text-gray-600" />
              }
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              id="login-remember-me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">or</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchPage}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </>
  );
};

export default Login;

