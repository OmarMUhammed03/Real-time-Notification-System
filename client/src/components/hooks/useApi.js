/**
 * ========================================
 * HOOK: useApi & useApiMutation
 * ========================================
 * Generic hooks for API calls and mutations
 * Provides loading states, error handling, and data management
 */

import { useState, useEffect } from 'react';

/**
 * Generic hook for API data fetching with loading and error states
 * @param {Function} apiCall - Async function that makes the API call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {*} fallbackData - Optional fallback data when API is unavailable
 * @returns {Object} API state and refetch function
 */
export function useApi(apiCall, dependencies = [], fallbackData = null) {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [state, setState] = useState({
    data: fallbackData,
    loading: true,
    error: null,
  });

  /**
   * Fetch data from API with error handling
   */
  const fetchData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Execute the API call
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'An error occurred';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `HTTP ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error - please check your connection';
      } else if (error instanceof Error) {
        // Other error types
        errorMessage = error.message;
      } else if (error.code === 'NETWORK_ERROR' || error.name === 'NetworkError') {
        // Specific network error handling
        errorMessage = 'Network error - API server unavailable';
      } else if (typeof error === 'string' && error.includes('fetch')) {
        // Fetch-related errors
        errorMessage = 'Network error - API server unavailable';
      }
      
      // Use fallback data if available when network fails
      const dataToUse = (errorMessage.includes('Network error') && fallbackData) ? fallbackData : null;
      
      setState({
        data: dataToUse,
        loading: false,
        error: errorMessage,
      });
      
      // Only log actual errors, not expected network failures
      if (!errorMessage.includes('Network error')) {
        console.error('API Error:', error);
      }
    }
  };

  // ========================================
  // EFFECT HOOK
  // ========================================
  
  useEffect(() => {
    fetchData();
  }, dependencies);

  // ========================================
  // RETURN VALUES
  // ========================================
  
  return {
    ...state,
    refetch: fetchData,
  };
}

/**
 * Generic hook for API mutations (POST, PUT, DELETE operations)
 * @returns {Object} Mutation state and mutate function
 */
export function useApiMutation() {
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Execute a mutation with loading and error handling
   * @param {Function} apiCall - Async function that makes the API call
   * @param {*} params - Parameters to pass to the API call
   * @returns {Promise} Result of the API call
   */
  const mutate = async (apiCall, params) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      // Execute the API call with parameters
      const data = await apiCall(params);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      // Handle different types of errors
      let errorMessage = 'An error occurred';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `HTTP ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Network error - please check your connection';
      } else if (error instanceof Error) {
        // Other error types
        errorMessage = error.message;
      }
      
      setState({ data: null, loading: false, error: errorMessage });
      
      // TODO: Add error logging/reporting
      console.error('API Mutation Error:', error);
      
      // Re-throw error so calling code can handle it
      throw error;
    }
  };

  // ========================================
  // RETURN VALUES
  // ========================================
  
  return {
    ...state,
    mutate,
  };
}