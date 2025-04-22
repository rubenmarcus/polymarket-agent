import { NextResponse } from 'next/server';

export async function GET() {
  const host = process.env.VERCEL_URL || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  return NextResponse.json({
    openapi: "3.0.0",
    info: {
      title: "Polymarket Agent",
      description: "API for accessing Polymarket prediction market data and executing transactions",
      version: "1.0.0",
    },
    servers: [
      {
        url: `${protocol}://${host}`,
      },
    ],
    "x-mb": {
      "account-id": process.env.ACCOUNT_ID || "",
      assistant: {
        name: "Polymarket Assistant",
        description: "An assistant that helps users interact with Polymarket prediction markets, analyze market data, and execute transactions.",
        instructions: "You help users interact with Polymarket prediction markets. You can retrieve market data, perform analysis, and execute transactions on behalf of users. For market data, you can list markets, get specific market details, find trending markets, and search for markets. For analysis, you can analyze market performance, compare markets, and identify sentiment. For transactions, you can place bets, manage liquidity, and check transaction history.",
        tools: [
          { type: "generate-transaction" },
          { type: "sign-message" }
        ]
      },
    },
    paths: {
      // Market Data Endpoints
      "/api/tools/polymarket/markets": {
        get: {
          summary: "List all markets",
          description: "Returns a list of all available markets on Polymarket",
          operationId: "listMarkets",
          parameters: [
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", default: 10 },
              description: "Maximum number of markets to return"
            },
            {
              name: "offset",
              in: "query",
              required: false,
              schema: { type: "integer", default: 0 },
              description: "Number of markets to skip"
            },
            {
              name: "category",
              in: "query",
              required: false,
              schema: { type: "string" },
              description: "Filter markets by category"
            },
            {
              name: "status",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["open", "closed", "resolved"]
              },
              description: "Filter markets by status"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      markets: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            question: { type: "string" },
                            description: { type: "string" },
                            category: { type: "string" },
                            status: { type: "string" },
                            volume: { type: "number" },
                            liquidity: { type: "number" },
                            outcomes: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  name: { type: "string" },
                                  probability: { type: "number" },
                                  price: { type: "number" }
                                }
                              }
                            },
                            endDate: { type: "string", format: "date-time" }
                          }
                        }
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          limit: { type: "integer" },
                          offset: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/markets/{id}": {
        get: {
          summary: "Get specific market",
          description: "Returns detailed information about a specific market",
          operationId: "getMarket",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Market ID"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      question: { type: "string" },
                      description: { type: "string" },
                      category: { type: "string" },
                      status: { type: "string" },
                      volume: { type: "number" },
                      liquidity: { type: "number" },
                      outcomes: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            name: { type: "string" },
                            probability: { type: "number" },
                            price: { type: "number" }
                          }
                        }
                      },
                      endDate: { type: "string", format: "date-time" },
                      createdAt: { type: "string", format: "date-time" },
                      resolutionDetails: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Market not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/markets/trending": {
        get: {
          summary: "Get trending markets",
          description: "Returns a list of trending markets based on volume and activity",
          operationId: "getTrendingMarkets",
          parameters: [
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", default: 5 },
              description: "Maximum number of trending markets to return"
            },
            {
              name: "timeframe",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["24h", "7d", "30d"],
                default: "24h"
              },
              description: "Timeframe for trending calculation"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      markets: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            question: { type: "string" },
                            volume: { type: "number" },
                            volumeChange: { type: "number" },
                            liquidity: { type: "number" },
                            outcomes: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  name: { type: "string" },
                                  probability: { type: "number" },
                                  priceChange: { type: "number" }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/markets/search": {
        get: {
          summary: "Search markets",
          description: "Search for markets based on query string",
          operationId: "searchMarkets",
          parameters: [
            {
              name: "q",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Search query"
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", default: 10 },
              description: "Maximum number of results to return"
            },
            {
              name: "offset",
              in: "query",
              required: false,
              schema: { type: "integer", default: 0 },
              description: "Number of results to skip"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      markets: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            question: { type: "string" },
                            description: { type: "string" },
                            category: { type: "string" },
                            status: { type: "string" },
                            outcomes: {
                              type: "array",
                              items: {
                                type: "object",
                                properties: {
                                  name: { type: "string" },
                                  probability: { type: "number" }
                                }
                              }
                            }
                          }
                        }
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          limit: { type: "integer" },
                          offset: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // Analysis Endpoints
      "/api/tools/polymarket/analysis/market/{id}": {
        get: {
          summary: "Analyze market",
          description: "Provides detailed analysis of a specific market",
          operationId: "analyzeMarket",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Market ID"
            },
            {
              name: "timeframe",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["24h", "7d", "30d", "all"],
                default: "7d"
              },
              description: "Timeframe for analysis"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      marketId: { type: "string" },
                      question: { type: "string" },
                      volumeAnalysis: {
                        type: "object",
                        properties: {
                          total: { type: "number" },
                          change: { type: "number" },
                          trend: { type: "string" }
                        }
                      },
                      priceHistory: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            timestamp: { type: "string", format: "date-time" },
                            prices: {
                              type: "object",
                              additionalProperties: { type: "number" }
                            }
                          }
                        }
                      },
                      volatility: { type: "number" },
                      liquidityDepth: { type: "number" },
                      tradingActivity: {
                        type: "object",
                        properties: {
                          totalTrades: { type: "integer" },
                          uniqueTraders: { type: "integer" },
                          averageTradeSize: { type: "number" }
                        }
                      },
                      keyEvents: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            timestamp: { type: "string", format: "date-time" },
                            event: { type: "string" },
                            impact: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Market not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/analysis/compare": {
        get: {
          summary: "Compare markets",
          description: "Compares multiple markets to identify correlations and differences",
          operationId: "compareMarkets",
          parameters: [
            {
              name: "ids",
              in: "query",
              required: true,
              schema: { type: "string" },
              description: "Comma-separated list of market IDs to compare"
            },
            {
              name: "timeframe",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["24h", "7d", "30d", "all"],
                default: "7d"
              },
              description: "Timeframe for comparison"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      markets: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            question: { type: "string" }
                          }
                        }
                      },
                      correlation: {
                        type: "object",
                        properties: {
                          matrix: {
                            type: "array",
                            items: {
                              type: "array",
                              items: { type: "number" }
                            }
                          },
                          interpretation: { type: "string" }
                        }
                      },
                      volumeComparison: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            marketId: { type: "string" },
                            volume: { type: "number" },
                            volumeChange: { type: "number" }
                          }
                        }
                      },
                      priceMovementComparison: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            marketId: { type: "string" },
                            priceChange: { type: "number" },
                            volatility: { type: "number" }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "404": {
              description: "One or more markets not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      missingMarkets: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/analysis/sentiment/{id}": {
        get: {
          summary: "Market sentiment analysis",
          description: "Analyzes market sentiment based on price movements and trading activity",
          operationId: "analyzeSentiment",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Market ID"
            },
            {
              name: "timeframe",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["24h", "7d", "30d"],
                default: "24h"
              },
              description: "Timeframe for sentiment analysis"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      marketId: { type: "string" },
                      question: { type: "string" },
                      overallSentiment: {
                        type: "object",
                        properties: {
                          score: { type: "number" },
                          label: { 
                            type: "string",
                            enum: ["very bearish", "bearish", "neutral", "bullish", "very bullish"]
                          },
                          confidence: { type: "number" }
                        }
                      },
                      sentimentByOutcome: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            outcome: { type: "string" },
                            sentiment: {
                              type: "object",
                              properties: {
                                score: { type: "number" },
                                label: { type: "string" },
                                confidence: { type: "number" }
                              }
                            }
                          }
                        }
                      },
                      sentimentTrend: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            timestamp: { type: "string", format: "date-time" },
                            sentiment: { type: "number" }
                          }
                        }
                      },
                      keyInsights: {
                        type: "array",
                        items: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            "404": {
              description: "Market not found",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },

      // Transaction Endpoints
      "/api/tools/polymarket/transaction/bet": {
        post: {
          summary: "Place a bet",
          description: "Places a bet on a specific market outcome",
          operationId: "placeBet",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["marketId", "outcome", "amount"],
                  properties: {
                    marketId: { type: "string" },
                    outcome: { type: "string" },
                    amount: { type: "number" },
                    maxSlippage: { 
                      type: "number",
                      default: 0.05,
                      description: "Maximum acceptable slippage as a decimal (e.g., 0.05 for 5%)"
                    }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionId: { type: "string" },
                      marketId: { type: "string" },
                      outcome: { type: "string" },
                      amount: { type: "number" },
                      estimatedReturn: { type: "number" },
                      timestamp: { type: "string", format: "date-time" },
                      status: { type: "string" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/transaction/liquidity/add": {
        post: {
          summary: "Add liquidity",
          description: "Adds liquidity to a market",
          operationId: "addLiquidity",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["marketId", "amount"],
                  properties: {
                    marketId: { type: "string" },
                    amount: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionId: { type: "string" },
                      marketId: { type: "string" },
                      amount: { type: "number" },
                      lpTokens: { type: "number" },
                      timestamp: { type: "string", format: "date-time" },
                      status: { type: "string" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/transaction/liquidity/remove": {
        post: {
          summary: "Remove liquidity",
          description: "Removes liquidity from a market",
          operationId: "removeLiquidity",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["marketId", "lpTokens"],
                  properties: {
                    marketId: { type: "string" },
                    lpTokens: { type: "number" }
                  }
                }
              }
            }
          },
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactionId: { type: "string" },
                      marketId: { type: "string" },
                      lpTokens: { type: "number" },
                      amountReturned: { type: "number" },
                      timestamp: { type: "string", format: "date-time" },
                      status: { type: "string" }
                    }
                  }
                }
              }
            },
            "400": {
              description: "Bad request",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/tools/polymarket/transaction/history": {
        get: {
          summary: "Get transaction history",
          description: "Returns transaction history for the user",
          operationId: "getTransactionHistory",
          parameters: [
            {
              name: "limit",
              in: "query",
              required: false,
              schema: { type: "integer", default: 10 },
              description: "Maximum number of transactions to return"
            },
            {
              name: "offset",
              in: "query",
              required: false,
              schema: { type: "integer", default: 0 },
              description: "Number of transactions to skip"
            },
            {
              name: "type",
              in: "query",
              required: false,
              schema: { 
                type: "string",
                enum: ["bet", "liquidity", "all"],
                default: "all"
              },
              description: "Type of transactions to return"
            }
          ],
          responses: {
            "200": {
              description: "Successful response",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      transactions: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            type: { type: "string" },
                            marketId: { type: "string" },
                            marketQuestion: { type: "string" },
                            amount: { type: "number" },
                            details: { type: "object" },
                            timestamp: { type: "string", format: "date-time" },
                            status: { type: "string" }
                          }
                        }
                      },
                      pagination: {
                        type: "object",
                        properties: {
                          total: { type: "integer" },
                          limit: { type: "integer" },
                          offset: { type: "integer" }
                        }
                      }
                    }
                  }
                }
              }
            },
            "401": {
              description: "Unauthorized",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            },
            "500": {
              description: "Server error",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });
}
