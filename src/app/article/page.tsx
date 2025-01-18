"use client";

import { useState } from "react";

import Header from "@/app/components/Header";
import Spinner from "@/app/components/Spinner";
import Subtitle from "@/app/components/topic";
import { useAuth } from "../context/AuthContext";

interface Article {
    index: number;
    title: string;
    link: string;
    snippet: string;
  }
 

const Page: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentTopic, setCurrentTopic] = useState<string>("");
  const extractDomain = (url: string): string => {
    try {
      const domain = new URL(url).hostname
        .replace('www.', '')
        .split('.')[0]
        .toLowerCase();
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return 'Unknown';
    }
  };
  const fetchArticles = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/getArticle?userId=${user.uid}`);
      if (!res.ok) throw new Error("Failed to fetch articles");

      const data = await res.json();
      setArticles(data.results);
      setCurrentTopic(data.topic);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderArticles = () => {
    if (!articles.length) return null;
  
    return (
      <div className="flex flex-col space-y-8 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white text-center">
          Bits about <span className="text-blue-400">{currentTopic}</span>
        </h2>
        <div className="grid md:grid-cols-2  gap-6">
          {articles.map((article) => (
            <a
              key={article.index}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={async (e) => {
                e.preventDefault()
                window.open(article.link, '_blank');
              }}
              className="flex flex-col p-6 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <h3 className="text-xl font-semibold text-white mb-3">
                {article.title}
              </h3>
              <span className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-300 mb-3">
                {extractDomain(article.link)}
              </span>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {article.snippet}
              </p>
              <div className="mt-auto flex items-center text-blue-400 text-sm hover:text-blue-300">
                Read more
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Header/>
      <main className="flex flex-col items-center py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">
          <Subtitle text="Your Bits for today" />
        </h1>
        <button
          onClick={fetchArticles}
          disabled={loading}
          className="mb-8 hover:button-gradient-hover relative inline-flex items-center justify-center rounded-lg px-8 py-3 text-xl text-black shadow-button button-border-gradient"
        >
          {loading ? <Spinner /> : <span className="z-10">Get Articles</span>}
        </button>
        {renderArticles()}
      </main>
    </div>
  );
};
export default Page;