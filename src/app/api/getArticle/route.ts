import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';

interface UserDocument {
  userId: string;
  topics: string[];
}

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
}

interface FormattedSearchResult {
  index: number;
  title: string;
  link: string;
  snippet: string;
}

const API_KEY = process.env.NEXT_GOOGLE_API_KEY;
const CX = process.env.NEXT_GOOGLE_CX;
const MONGODB_URI = process.env.NEXT_MONGODB_URI;

if (!API_KEY || !CX || !MONGODB_URI) {
  throw new Error('Missing required environment variables');
}

const client = new MongoClient(MONGODB_URI);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Connect to MongoDB and get user's topics
    await client.connect();
    const db = client.db('users_db');
    const collection = db.collection<UserDocument>('users');
    
    const userDoc = await collection.findOne({ userId });
    if (!userDoc || !userDoc.topics.length) {
      throw new Error('No topics found for user');
    }

    // Get random topic from user's topics array
    const randomIndex = Math.floor(Math.random() * userDoc.topics.length);
    const topic = userDoc.topics[randomIndex];

    const query = `trending articles on ${topic} `;
    const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${API_KEY}&cx=${CX}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
     
    const data = await response.json();
    console.log(data)
    const results = data.items || [];

    return NextResponse.json({
      message: "Search Results:",
      topic,
      results: results.map((item: SearchResult, index: number): FormattedSearchResult => ({
        index: index + 1,
        title: item.title,
        link: item.link,
        snippet: item.snippet
      })),
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: "Error fetching search results" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}