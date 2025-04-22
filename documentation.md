# Polymarket AI Agent Documentation

## Overview

The Polymarket AI agent is a Next.js application that allows users to fetch data about prediction markets, perform market analysis, and execute transactions on Polymarket. This documentation provides comprehensive information about the API endpoints, usage patterns, and implementation details.

## Table of Contents

1. [API Reference](#api-reference)
   - [Market Data Endpoints](#market-data-endpoints)
   - [Analysis Endpoints](#analysis-endpoints)
   - [Transaction Endpoints](#transaction-endpoints)
2. [User Guide](#user-guide)
   - [Getting Started](#getting-started)
   - [Fetching Market Data](#fetching-market-data)
   - [Analyzing Markets](#analyzing-markets)
   - [Executing Transactions](#executing-transactions)
3. [Developer Guide](#developer-guide)
   - [Project Structure](#project-structure)
   - [Authentication](#authentication)
   - [Error Handling](#error-handling)
   - [Extending the API](#extending-the-api)
4. [Deployment Guide](#deployment-guide)
   - [Environment Setup](#environment-setup)
   - [Deployment Process](#deployment-process)

## API Reference

### Market Data Endpoints

#### List All Markets

```
GET /api/tools/polymarket/markets
```

Returns a list of all available markets on Polymarket.

**Query Parameters:**
- `limit` (optional): Maximum number of markets to return (default: 10)
- `offset` (optional): Number of markets to skip (default: 0)
- `category` (optional): Filter markets by category
- `status` (optional): Filter markets by status (`open`, `closed`, `resolved`)

**Response:**
```json
{
  "markets": [
    {
      "id": "string",
      "question": "string",
      "description": "string",
      "category": "string",
      "status": "string",
      "volume": 0,
      "liquidity": 0,
      "outcomes": [
        {
          "name": "string",
          "probability": 0,
          "price": 0
        }
      ],
      "endDate": "2025-04-21T23:00:00Z"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

#### Get Specific Market

```
GET /api/tools/polymarket/markets/{id}
```

Returns detailed information about a specific market.

**Path Parameters:**
- `id`: Market ID

**Response:**
```json
{
  "id": "string",
  "question": "string",
  "description": "string",
  "category": "string",
  "status": "string",
  "volume": 0,
  "liquidity": 0,
  "outcomes": [
    {
      "name": "string",
      "probability": 0,
      "price": 0
    }
  ],
  "endDate": "2025-04-21T23:00:00Z",
  "createdAt": "2025-04-01T12:00:00Z",
  "resolutionDetails": "string"
}
```

#### Get Trending Markets

```
GET /api/tools/polymarket/markets/trending
```

Returns a list of trending markets based on volume and activity.

**Query Parameters:**
- `limit` (optional): Maximum number of trending markets to return (default: 5)
- `timeframe` (optional): Timeframe for trending calculation (`24h`, `7d`, `30d`, default: `24h`)

**Response:**
```json
{
  "markets": [
    {
      "id": "string",
      "question": "string",
      "volume": 0,
      "volumeChange": 0,
      "liquidity": 0,
      "outcomes": [
        {
          "name": "string",
          "probability": 0,
          "priceChange": 0
        }
      ]
    }
  ]
}
```

#### Search Markets

```
GET /api/tools/polymarket/markets/search
```

Search for markets based on query string.

**Query Parameters:**
- `q`: Search query (required)
- `limit` (optional): Maximum number of results to return (default: 10)
- `offset` (optional): Number of results to skip (default: 0)

**Response:**
```json
{
  "markets": [
    {
      "id": "string",
      "question": "string",
      "description": "string",
      "category": "string",
      "status": "string",
      "outcomes": [
        {
          "name": "string",
          "probability": 0
        }
      ]
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

### Analysis Endpoints

#### Analyze Market

```
GET /api/tools/polymarket/analysis/market/{id}
```

Provides detailed analysis of a specific market.

**Path Parameters:**
- `id`: Market ID

**Query Parameters:**
- `timeframe` (optional): Timeframe for analysis (`24h`, `7d`, `30d`, `all`, default: `7d`)

**Response:**
```json
{
  "marketId": "string",
  "question": "string",
  "volumeAnalysis": {
    "total": 0,
    "change": 0,
    "trend": "string"
  },
  "priceHistory": [
    {
      "timestamp": "2025-04-21T23:00:00Z",
      "prices": {
        "Yes": 0.7,
        "No": 0.3
      }
    }
  ],
  "volatility": 0,
  "liquidityDepth": 0,
  "tradingActivity": {
    "totalTrades": 0,
    "uniqueTraders": 0,
    "averageTradeSize": 0
  },
  "keyEvents": [
    {
      "timestamp": "2025-04-21T23:00:00Z",
      "event": "string",
      "impact": 0
    }
  ]
}
```

#### Compare Markets

```
GET /api/tools/polymarket/analysis/compare
```

Compares multiple markets to identify correlations and differences.

**Query Parameters:**
- `ids`: Comma-separated list of market IDs to compare (required)
- `timeframe` (optional): Timeframe for comparison (`24h`, `7d`, `30d`, `all`, default: `7d`)

**Response:**
```json
{
  "markets": [
    {
      "id": "string",
      "question": "string"
    }
  ],
  "correlation": {
    "matrix": [
      [1, 0.5],
      [0.5, 1]
    ],
    "interpretation": "string"
  },
  "volumeComparison": [
    {
      "marketId": "string",
      "volume": 0,
      "volumeChange": 0
    }
  ],
  "priceMovementComparison": [
    {
      "marketId": "string",
      "priceChange": 0,
      "volatility": 0
    }
  ]
}
```

#### Market Sentiment Analysis

```
GET /api/tools/polymarket/analysis/sentiment/{id}
```

Analyzes market sentiment based on price movements and trading activity.

**Path Parameters:**
- `id`: Market ID

**Query Parameters:**
- `timeframe` (optional): Timeframe for sentiment analysis (`24h`, `7d`, `30d`, default: `24h`)

**Response:**
```json
{
  "marketId": "string",
  "question": "string",
  "overallSentiment": {
    "score": 0,
    "label": "neutral",
    "confidence": 0
  },
  "sentimentByOutcome": [
    {
      "outcome": "string",
      "sentiment": {
        "score": 0,
        "label": "string",
        "confidence": 0
      }
    }
  ],
  "sentimentTrend": [
    {
      "timestamp": "2025-04-21T23:00:00Z",
      "sentiment": 0
    }
  ],
  "keyInsights": [
    "string"
  ]
}
```

### Transaction Endpoints

#### Place a Bet

```
POST /api/tools/polymarket/transaction/bet
```

Places a bet on a specific market outcome.

**Request Body:**
```json
{
  "marketId": "string",
  "outcome": "string",
  "amount": 0,
  "maxSlippage": 0.05
}
```

**Response:**
```json
{
  "transactionId": "string",
  "marketId": "string",
  "outcome": "string",
  "amount": 0,
  "estimatedReturn": 0,
  "timestamp": "2025-04-21T23:00:00Z",
  "status": "string"
}
```

#### Add Liquidity

```
POST /api/tools/polymarket/transaction/liquidity/add
```

Adds liquidity to a market.

**Request Body:**
```json
{
  "marketId": "string",
  "amount": 0
}
```

**Response:**
```json
{
  "transactionId": "string",
  "marketId": "string",
  "amount": 0,
  "lpTokens": 0,
  "timestamp": "2025-04-21T23:00:00Z",
  "status": "string"
}
```

#### Remove Liquidity

```
POST /api/tools/polymarket/transaction/liquidity/remove
```

Removes liquidity from a market.

**Request Body:**
```json
{
  "marketId": "string",
  "lpTokens": 0
}
```

**Response:**
```json
{
  "transactionId": "string",
  "marketId": "string",
  "lpTokens": 0,
  "amountReturned": 0,
  "timestamp": "2025-04-21T23:00:00Z",
  "status": "string"
}
```

#### Get Transaction History

```
GET /api/tools/polymarket/transaction/history
```

Returns transaction history for the user.

**Query Parameters:**
- `limit` (optional): Maximum number of transactions to return (default: 10)
- `offset` (optional): Number of transactions to skip (default: 0)
- `type` (optional): Type of transactions to return (`bet`, `liquidity`, `all`, default: `all`)

**Response:**
```json
{
  "transactions": [
    {
      "id": "string",
      "type": "string",
      "marketId": "string",
      "marketQuestion": "string",
      "amount": 0,
      "details": {},
      "timestamp": "2025-04-21T23:00:00Z",
      "status": "string"
    }
  ],
  "pagination": {
    "total": 0,
    "limit": 10,
    "offset": 0
  }
}
```

## User Guide

### Getting Started

The Polymarket AI agent allows you to interact with Polymarket prediction markets through a conversational interface. You can ask questions about markets, get analysis, and execute transactions.

To get started, you can:
1. Ask about current markets: "What are the current trending markets on Polymarket?"
2. Get specific market information: "Tell me about the 2025 presidential election market"
3. Analyze markets: "Analyze the sentiment for the Bitcoin price prediction market"
4. Execute transactions: "I want to bet $50 on Yes for the market about SpaceX reaching Mars"

### Fetching Market Data

You can fetch market data in several ways:

1. **Browse markets**: Ask for a list of markets, optionally filtered by category or status
   - "Show me all open markets"
   - "What are the politics markets on Polymarket?"

2. **Search for specific markets**: Search by keywords or topics
   - "Find markets about Bitcoin"
   - "Are there any markets about the 2025 elections?"

3. **Get trending markets**: See what's popular right now
   - "What are the trending markets today?"
   - "Show me the most active markets this week"

4. **Get detailed market information**: Get comprehensive details about a specific market
   - "Tell me more about the market on whether Bitcoin will reach $100,000 this year"
   - "What are the current odds for the Super Bowl winner market?"

### Analyzing Markets

The agent provides several analysis capabilities:

1. **Market analysis**: Get detailed analysis of a specific market
   - "Analyze the Bitcoin price prediction market"
   - "What's the trading activity like for the presidential election market?"

2. **Market comparison**: Compare multiple markets to identify correlations
   - "Compare the Bitcoin and Ethereum price prediction markets"
   - "How do the presidential and congressional election markets correlate?"

3. **Sentiment analysis**: Understand the market sentiment
   - "What's the sentiment for the SpaceX Mars landing market?"
   - "Is the sentiment bullish or bearish for the Bitcoin price market?"

### Executing Transactions

You can execute various transactions through the agent:

1. **Place bets**: Bet on specific market outcomes
   - "I want to bet $50 on Yes for the Bitcoin price prediction market"
   - "Place a bet of $100 on Democrats winning the presidential election"

2. **Manage liquidity**: Add or remove liquidity from markets
   - "Add $200 liquidity to the SpaceX Mars landing market"
   - "Remove my liquidity from the Super Bowl winner market"

3. **Check transaction history**: View your past transactions
   - "Show me my transaction history"
   - "What bets have I placed in the last week?"

## Developer Guide

### Project Structure

The Polymarket AI agent follows the Next.js App Router structure with the following organization:

```
polymarket-agent/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai-plugin/
│   │   │   │   └── route.ts           # OpenAPI specification
│   │   │   ├── tools/
│   │   │   │   ├── polymarket/
│   │   │   │   │   ├── config.ts      # Configuration and helpers
│   │   │   │   │   ├── markets/       # Market data endpoints
│   │   │   │   │   │   ├── route.ts
│   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   ├── trending/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── search/
│   │   │   │   │   │       └── route.ts
│   │   │   │   │   ├── analysis/      # Analysis endpoints
│   │   │   │   │   │   ├── market/
│   │   │   │   │   │   │   ├── [id]/
│   │   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   ├── compare/
│   │   │   │   │   │   │   └── route.ts
│   │   │   │   │   │   └── sentiment/
│   │   │   │   │   │       ├── [id]/
│   │   │   │   │   │       │   └── route.ts
│   │   │   │   │   └── transaction/   # Transaction endpoints
│   │   │   │   │       ├── bet/
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       ├── liquidity/
│   │   │   │   │       │   ├── add/
│   │   │   │   │       │   │   └── route.ts
│   │   │   │   │       │   └── remove/
│   │   │   │   │       │       └── route.ts
│   │   │   │   │       └── history/
│   │   │   │   │           └── route.ts
```

### Authentication

The Polymarket AI agent uses a proxy approach for authentication to avoid exposing API keys to clients. Authentication is handled through environment variables:

```
POLYMARKET_API_URL=https://api.polymarket.com
POLYMARKET_API_KEY=your-api-key
```

The `config.ts` file provides helper functions for authentication:

```typescript
export const getAuthHeaders = () => {
  if (!POLYMARKET_API_KEY) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${POLYMARKET_API_KEY}`
  };
};
```

### Error Handling

The agent implements consistent error handling across all endpoints using the `handleApiError` helper function:

```typescript
export const handleApiError = (error: any) => {
  console.error('Polymarket API error:', error);
  
  if (error.response) {
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
    return { error: 'No response from Polymarket API', status: 500 };
  } else {
    return { error: `Error: ${error.message}`, status: 500 };
  }
};
```

### Extending the API

To add new endpoints to the Polymarket AI agent:

1. Update the OpenAPI specification in `src/app/api/ai-plugin/route.ts`
2. Create the appropriate directory structure for the new endpoint
3. Implement the endpoint logic following the existing patterns
4. Add error handling using the `handleApiError` helper function
5. Update the documentation to reflect the new endpoint

## Deployment Guide

### Environment Setup

Before deploying the Polymarket AI agent, you need to set up the following environment variables:

```
POLYMARKET_API_URL=https://api.polymarket.com
POLYMARKET_API_KEY=your-api-key
ACCOUNT_ID=your-account-id
```

For local development, create a `.env.local` file with these variables.

### Deployment Process

The Polymarket AI agent can be deployed to Vercel or any other hosting platform that supports Next.js applications.

**Deploying to Vercel:**

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the required environment variables in the Vercel project settings
4. Deploy the application

**Building for production:**

```bash
npm run build
```

This will create a production-ready build of the application.

**Starting the production server:**

```bash
npm start
```

This will start the production server for the application.
