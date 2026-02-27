/**
 * Centralized Configuration for the Frontend
 * This file ensures that we don't have hardcoded URLs across the codebase.
 */

// If VITE_API_URL is not set, we fallback to localhost:3000
// Note: In development, Vite proxy can also be used if VITE_API_URL is empty.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const CONFIG = {
    API_URL,
    isDevelopment: import.meta.env.MODE === 'development',
    // Add other dynamic config here
};

export default CONFIG;
