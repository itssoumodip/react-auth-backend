// Configure API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://react-auth-backend-deploy.vercel.app'  // Your actual deployed backend URL
  : 'http://localhost:3006'; // In development, use localhost

export default API_BASE_URL;
