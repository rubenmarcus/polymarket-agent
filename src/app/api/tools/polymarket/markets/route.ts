import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, MarketStatus } from '../config';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    if (category) queryParams.append('category', category);
    if (status) queryParams.append('status', status);
    
    // Fetch data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/markets?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error fetching markets: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const markets = data.markets.map((market: any) => ({
      id: market.id,
      question: market.question,
      description: market.description || '',
      category: market.category || 'Uncategorized',
      status: market.status,
      volume: market.volume || 0,
      liquidity: market.liquidity || 0,
      outcomes: market.outcomes.map((outcome: any) => ({
        name: outcome.name,
        probability: outcome.probability,
        price: outcome.price
      })),
      endDate: market.endDate
    }));
    
    // Return formatted response
    return NextResponse.json({
      markets,
      pagination: {
        total: data.total,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error in markets endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
