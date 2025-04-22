import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError } from '../../../config';

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    if (!body.marketId) {
      return NextResponse.json({ error: 'Market ID is required' }, { status: 400 });
    }
    
    if (!body.lpTokens || body.lpTokens <= 0) {
      return NextResponse.json({ error: 'Valid LP tokens amount is required' }, { status: 400 });
    }
    
    // Prepare request payload
    const payload = {
      marketId: body.marketId,
      lpTokens: body.lpTokens
    };
    
    // Send request to Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/transaction/liquidity/remove`,
      {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
      }
      
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'Failed to remove liquidity' }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const transaction = {
      transactionId: data.transactionId,
      marketId: data.marketId,
      lpTokens: data.lpTokens,
      amountReturned: data.amountReturned,
      timestamp: data.timestamp,
      status: data.status
    };
    
    // Return formatted response
    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error in remove liquidity endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
