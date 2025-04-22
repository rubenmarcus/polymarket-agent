import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError } from '../../config';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    
    // Fetch data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/markets/search?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Error searching markets: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const markets = data.markets.map((market: any) => ({
      id: market.id,
      question: market.question,
      description: market.description || '',
      category: market.category || 'Uncategorized',
      status: market.status,
      outcomes: market.outcomes.map((outcome: any) => ({
        name: outcome.name,
        probability: outcome.probability
      }))
    }));
    
    // Return formatted response
    return NextResponse.json({
      markets,
      pagination: {
        total: data.total || markets.length,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error in search markets endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
