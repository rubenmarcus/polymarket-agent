import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, TimeFrame } from '../../../config';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const marketId = params.id;
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || TimeFrame.WEEK;
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('timeframe', timeframe);
    
    // Fetch market data from Polymarket API
    const marketResponse = await fetch(
      `${POLYMARKET_API_URL}/markets/${marketId}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!marketResponse.ok) {
      if (marketResponse.status === 404) {
        return NextResponse.json({ error: 'Market not found' }, { status: 404 });
      }
      throw new Error(`Error fetching market: ${marketResponse.statusText}`);
    }
    
    const market = await marketResponse.json();
    
    // Fetch market analysis data
    const analysisResponse = await fetch(
      `${POLYMARKET_API_URL}/markets/${marketId}/analysis?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!analysisResponse.ok) {
      throw new Error(`Error fetching market analysis: ${analysisResponse.statusText}`);
    }
    
    const analysisData = await analysisResponse.json();
    
    // Transform data to match our API schema
    const analysis = {
      marketId: market.id,
      question: market.question,
      volumeAnalysis: {
        total: analysisData.volume?.total || 0,
        change: analysisData.volume?.change || 0,
        trend: analysisData.volume?.trend || 'stable'
      },
      priceHistory: analysisData.priceHistory?.map((point: any) => ({
        timestamp: point.timestamp,
        prices: point.prices
      })) || [],
      volatility: analysisData.volatility || 0,
      liquidityDepth: analysisData.liquidityDepth || 0,
      tradingActivity: {
        totalTrades: analysisData.tradingActivity?.totalTrades || 0,
        uniqueTraders: analysisData.tradingActivity?.uniqueTraders || 0,
        averageTradeSize: analysisData.tradingActivity?.averageTradeSize || 0
      },
      keyEvents: analysisData.keyEvents?.map((event: any) => ({
        timestamp: event.timestamp,
        event: event.description,
        impact: event.impact
      })) || []
    };
    
    // Return formatted response
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in market analysis endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
