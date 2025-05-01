// Configure API URL based on the current hostname
let API_BASE_URL;

// Check if we're running on the production domain
if (window.location.hostname === 'react-auth-backend.vercel.app' || 
    window.location.hostname === 'react-auth-backend-deploy.vercel.app') {
  // In production, use the backend Vercel URL
  API_BASE_URL = 'https://react-auth-backend-deploy.vercel.app';
} else {
  // In development or other environments, use localhost
  API_BASE_URL = 'http://localhost:3006';
}

export default API_BASE_URL;
