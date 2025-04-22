// Configuration for Polymarket API integration

export const POLYMARKET_API_URL =  || 'https://api.polymarket.com';
export const POLYMARKET_API_KEY = process.env.POLYMARKET_API_KEY || '';

// Helper function to get authentication headers if API key is available
export const getAuthHeaders = () => {
  if (!POLYMARKET_API_KEY) {
    return {};
  }

  return {
    'Authorization': `Bearer ${POLYMARKET_API_KEY}`
  };
};

// Helper function to handle API errors
export const handleApiError = (error: any) => {
  console.error('Polymarket API error:', error);

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const message = error.response.data?.message || 'Unknown error';

    if (status === 404) {
      return { error: 'Resource not found', status: 404 };
    }

    if (status === 401) {
      return { error: 'Unauthorized access', status: 401 };
    }

    if (status === 400) {
      return { error: message, status: 400 };
    }

    return { error: `Server error: ${message}`, status: status };
  } else if (error.request) {
    // The request was made but no response was received
    return { error: 'No response from Polymarket API', status: 500 };
  } else {
    // Something happened in setting up the request that triggered an Error
    return { error: `Error: ${error.message}`, status: 500 };
  }
};

// Market status types
export enum MarketStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  RESOLVED = 'resolved'
}

// Timeframe options for analysis
export enum TimeFrame {
  DAY = '24h',
  WEEK = '7d',
  MONTH = '30d',
  ALL = 'all'
}

// Transaction types
export enum TransactionType {
  BET = 'bet',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
  ALL = 'all'
}
