/**
 * API URL configuration.
 *
 * This constant defines the base URL for all API endpoints.
 * It retrieves the value from the environment variable `VITE_API_URL`.
 * If the variable is not defined, it falls back to `http://localhost:7000`.
 *
 * @constant {string} API_URL - The base API URL.
 */
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:7000"
