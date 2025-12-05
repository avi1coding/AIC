import { NextRequest, NextResponse } from 'next/server';
import { getPool, initializeDatabase } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Initialize database and create tables if needed
    await initializeDatabase();

    return NextResponse.json(
      { message: 'Database connection successful and initialized' },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Connection failed';
    console.error('Database connection error:', error);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
