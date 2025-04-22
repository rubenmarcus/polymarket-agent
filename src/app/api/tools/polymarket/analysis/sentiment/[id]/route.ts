import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, TimeFrame } from '../../../config';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const marketId = params.id;
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get('timeframe') || TimeFrame.DAY;
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('timeframe', timeframe);
    
    // Fetch market data to ensure it exists
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
    
    // Fetch sentiment analysis data
    const sentimentResponse = await fetch(
      `${POLYMARKET_API_URL}/markets/${marketId}/sentiment?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!sentimentResponse.ok) {
      throw new Error(`Error fetching market sentiment: ${sentimentResponse.statusText}`);
    }
    
    const sentimentData = await sentimentResponse.json();
    
    // Transform data to match our API schema
    const sentiment = {
      marketId: market.id,
      question: market.question,
      overallSentiment: {
        score: sentimentData.overallSentiment?.score || 0,
        label: sentimentData.overallSentiment?.label || 'neutral',
        confidence: sentimentData.overallSentiment?.confidence || 0
      },
      sentimentByOutcome: sentimentData.sentimentByOutcome?.map((item: any) => ({
        outcome: item.outcome,
        sentiment: {
          score: item.sentiment?.score || 0,
          label: item.sentiment?.label || 'neutral',
          confidence: item.sentiment?.confidence || 0
        }
      })) || [],
      sentimentTrend: sentimentData.sentimentTrend?.map((point: any) => ({
        timestamp: point.timestamp,
        sentiment: point.sentiment
      })) || [],
      keyInsights: sentimentData.keyInsights || []
    };
    
    // Return formatted response
    return NextResponse.json(sentiment);
  } catch (error) {
    console.error('Error in market sentiment endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
