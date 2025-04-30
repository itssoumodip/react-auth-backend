import React, { useState } from 'react';

const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch("http://localhost:3001/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const result = await response.json();
      console.log(result, "passwordReset");
      
      if (result.message === "update") {
        setMessage('Password reset link sent to your email');
      } else if (result.message === "user not found") {  
        setMessage('Error: No account found with that email address');
      } else {
        setMessage('Error processing your request. Please try again.');
      }
    } catch (error) {
      setMessage('Error sending reset link. Please try again.');
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = () => {
    if (!message) return null;
    
    const isError = message.includes('Error');
    const className = `p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    
    return (
      <div className={className}>
        {message}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
      </div>
      
      {renderMessage()}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-1 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>
        
        <button 
          type="button" 
          onClick={props.onBackToLogin}
          className="w-full text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};

// Alternative: Class Component approach
/*
class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      isLoading: false,
      message: ''
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.state.email) {
      this.setState({ message: 'Please enter your email address' });
      return;
    }
    
    this.setState({ isLoading: true, message: '' });
    
    try {
      // API call would go here
      // Example: await api.sendPasswordResetEmail(this.state.email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.setState({ message: 'Password reset link sent to your email' });
    } catch (error) {
      this.setState({ message: 'Error sending reset link. Please try again.' });
      console.error('Reset password error:', error);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  renderMessage() {
    if (!this.state.message) return null;
    
    const isError = this.state.message.includes('Error');
    const className = `p-3 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    
    return (
      <div className={className}>
        {this.state.message}
      </div>
    );
  }

  render() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
        </div>
        
        {this.renderMessage()}
        
        <form className="space-y-4" onSubmit={this.handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              className="mt-1 w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <button 
            type="button" 
            onClick={this.props.onBackToLogin}
            className="w-full text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition duration-200"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }
}
*/

export default ForgotPassword;