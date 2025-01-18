import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

interface User {
  userId: string;
  topics: string[];
  timestamp: Date;
}

const uri = process.env.NEXT_MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined');
}
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const { userId, topics } = await request.json();
    
    if (!userId || !topics) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('users_db');
    const collection = database.collection<User>('users');

    const result = await collection.insertOne({
      userId,
      topics,
      timestamp: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId 
    });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to save topics' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}