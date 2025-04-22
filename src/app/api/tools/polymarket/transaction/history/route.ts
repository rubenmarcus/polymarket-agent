import { NextRequest, NextResponse } from 'next/server';
import { POLYMARKET_API_URL, getAuthHeaders, handleApiError, TransactionType } from '../../config';

export async function GET(req: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type') || TransactionType.ALL;
    
    // Build query parameters for Polymarket API
    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    if (type !== TransactionType.ALL) {
      queryParams.append('type', type);
    }
    
    // Fetch data from Polymarket API
    const response = await fetch(
      `${POLYMARKET_API_URL}/transaction/history?${queryParams.toString()}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json({ error: 'Unauthorized. Authentication required.' }, { status: 401 });
      }
      throw new Error(`Error fetching transaction history: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform data to match our API schema
    const transactions = data.transactions.map((tx: any) => ({
      id: tx.id,
      type: tx.type,
      marketId: tx.marketId,
      marketQuestion: tx.marketQuestion,
      amount: tx.amount,
      details: tx.details || {},
      timestamp: tx.timestamp,
      status: tx.status
    }));
    
    // Return formatted response
    return NextResponse.json({
      transactions,
      pagination: {
        total: data.total || transactions.length,
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error in transaction history endpoint:', error);
    const { error: errorMessage, status } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}
