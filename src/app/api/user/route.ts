import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

interface UserDoc {
  userId: string;
  topics: string[];
}

const MONGODB_URI = process.env.NEXT_MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

const client = new MongoClient(MONGODB_URI);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ exists: false });
    }

    await client.connect();
    const db = client.db('users_db');
    const collection = db.collection<UserDoc>('users');
    
    const exists = await collection.findOne({ userId });
    
    return NextResponse.json({
      exists: !!exists
    });

  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ exists: false }, { status: 500 });
  }
}