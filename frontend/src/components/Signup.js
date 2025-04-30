import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { FiMail, FiLock, FiUser, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import API_BASE_URL from '../config/api';

function Signup({ switchPage }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setSuccessMessage('');
        setErrors({});
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const result = await axios.post(`${API_BASE_URL}/register`, { 
                name: `${formData.firstName} ${formData.lastName}`, 
                email: formData.email, 
                password: formData.password 
            });
            
            console.log(result);
            
            if (result.data.x === "User Created Successfully") {
                setSuccessMessage('Account created successfully! Redirecting to home...');
                
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
                
                setTimeout(() => {
                    navigate('/home');
                }, 2000);
            } else {
                setErrors({ form: 'Registration failed. Please try again.' });
            }
        } catch (err) {
            console.log(err);
            setErrors({ form: 'Registration failed. Please try again.' });
            setSuccessMessage('');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 -mx-8 -mt-8 mb-6"></div>
            
            <div className="text-center mb-6">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                    <FiUser className="text-indigo-600 text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Create an account</h2>
                <p className="text-gray-500 mt-1">Please enter your details</p>
            </div>
            
            {errors.form && (
                <div className="p-3 mb-4 flex items-center gap-2 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <FiAlertCircle className="text-red-500 flex-shrink-0" />
                    <span className="text-sm">{errors.form}</span>
                </div>
            )}
            
            {successMessage && (
                <div className="p-3 mb-4 flex items-center gap-2 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
                    <FiCheckCircle className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">{successMessage}</span>
                </div>
            )}
            
            <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="firstName" className="text-sm font-medium text-gray-700 block mb-1">First Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiUser className="text-gray-400" />
                            </div>
                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`pl-10 w-full p-2 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                placeholder="First Name"
                            />
                        </div>
                        {errors.firstName && (
                            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="lastName" className="text-sm font-medium text-gray-700 block mb-1">Last Name</label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full p-2 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Last Name"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                        )}
                    </div>
                </div>
                
                <div>
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="text-gray-400" />
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Email address"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                </div>
                
                <div>
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Create a password"
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-1">Re-Enter Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="text-gray-400" />
                        </div>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`pl-10 w-full p-2 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="Confirm password"
                        />
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    className="w-full mt-2 bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 font-medium"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Creating account...
                        </span>
                    ) : 'Create account'}
                </button>
            </form>

            <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <button 
                        type="button"
                        onClick={switchPage}
                        className="text-blue-600 hover:text-indigo-700 font-medium"
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </>
    );
}

export default Signup;