import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError } from '../../config';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const marketId = params.id;
    
    // Fetch data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/markets/${marketId}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Market not found' }, { status: 404 });
      }
      throw new Error(`Error fetching market: ${response.statusText}`);
    }
    
    const market = await response.json();
    
    // Transform data to match our API schema
    const formattedMarket = {
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
      endDate: market.endDate,
      createdAt: market.createdAt,
      resolutionDetails: market.resolutionDetails || ''
    };
    
    // Return formatted response
    return NextResponse.json(formattedMarket);
  } catch (error) {
    console.error('Error in get market endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
