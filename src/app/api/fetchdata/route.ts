import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

interface ProgressData {
userId: string;
articleId: string;
topic: string;
articleTitle: string;
articleLink: string;
articleType: string;
date: Date;
}

const MONGODB_URI = process.env.NEXT_MONGODB_URI;

if (!MONGODB_URI) {
throw new Error('Missing required environment variables');
}
const client = new MongoClient(MONGODB_URI);

export async function GET(request: Request) {
try {
const { searchParams } = new URL(request.url);
const userId = searchParams.get('userId');

if (!userId) {
return NextResponse.json({
error: "userId is required"
}, { status: 400 });
}

await client.connect();
const db = client.db('users_db');
const collection = db.collection<ProgressData>('progress');

const progress = await collection
.find({ userId })
.sort({ date: -1 })
.toArray();

return NextResponse.json({
success: true,
progress
});

} catch (error) {
console.error('Error fetching progress:', error);
return NextResponse.json({
error: "Failed to fetch progress"
}, { status: 500 });
}
}