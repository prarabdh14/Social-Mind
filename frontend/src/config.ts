export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Debug logging
console.log('API_URL configured as:', API_URL);
console.log('VITE_API_URL env var:', import.meta.env.VITE_API_URL); 