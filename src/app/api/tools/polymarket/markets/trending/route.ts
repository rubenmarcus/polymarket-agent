import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, TimeFrame } from '../../config';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const timeframe = searchParams.get('timeframe') || TimeFrame.DAY;
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('timeframe', timeframe);
    
    // Fetch data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/markets/trending?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching trending markets: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const markets = data.markets.map((market: any) => ({
      id: market.id,
      question: market.question,
      volume: market.volume || 0,
      volumeChange: market.volumeChange || 0,
      liquidity: market.liquidity || 0,
      outcomes: market.outcomes.map((outcome: any) => ({
        name: outcome.name,
        probability: outcome.probability,
        priceChange: outcome.priceChange || 0
      }))
    }));
    
    // Return formatted response
    return NextResponse.json({ markets });
  } catch (error) {
    console.error('Error in trending markets endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
