// Simple auth API route - proxies to backend
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// This is a simple proxy route to your backend auth endpoints
// No NextAuth involved - just direct backend communication

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
    
    // Forward the request to your backend
    const response = await axios.post(`${apiUrl}/api/auth/login`, body);
    
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { error: error.response?.data?.message || 'Authentication failed' },
        { status: error.response?.status || 401 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Auth API route - use POST for login' });
}
