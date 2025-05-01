// Configure API URL based on environment
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? window.location.origin  // In production, use same origin (assuming backend is at same origin)
  : 'http://localhost:3006'; // In development, use localhost

export default API_BASE_URL;
