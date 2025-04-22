import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, TimeFrame } from '../../config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');
    const timeframe = searchParams.get('timeframe') || TimeFrame.WEEK;
    
    if (!idsParam) {
      return NextResponse.json({ error: 'Market IDs are required' }, { status: 400 });
    }
    
    const marketIds = idsParam.split(',');
    
    if (marketIds.length < 2) {
      return NextResponse.json({ error: 'At least two market IDs are required for comparison' }, { status: 400 });
    }
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('ids', idsParam);
    queryParams.append('timeframe', timeframe);
    
    // Fetch comparison data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/markets/compare?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        const errorData = await response.json();
        return NextResponse.json({
          error: 'One or more markets not found',
          missingMarkets: errorData.missingMarkets || []
        }, { status: 404 });
      }
      throw new Error(`Error comparing markets: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const comparison = {
      markets: data.markets.map((market: any) => ({
        id: market.id,
        question: market.question
      })),
      correlation: {
        matrix: data.correlation?.matrix || [],
        interpretation: data.correlation?.interpretation || ''
      },
      volumeComparison: data.volumeComparison?.map((item: any) => ({
        marketId: item.marketId,
        volume: item.volume || 0,
        volumeChange: item.volumeChange || 0
      })) || [],
      priceMovementComparison: data.priceMovementComparison?.map((item: any) => ({
        marketId: item.marketId,
        priceChange: item.priceChange || 0,
        volatility: item.volatility || 0
      })) || []
    };
    
    // Return formatted response
    return NextResponse.json(comparison);
  } catch (error) {
    console.error('Error in compare markets endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
