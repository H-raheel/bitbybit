"use client";

import Header from "@/app/components/Header";
import Spinner from "@/app/components/Spinner";
import Subtitle from "@/app/components/topic";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page: React.FC = () => {
  const router=useRouter();
  const { logOut, user } = useAuth();
  const [moreLoading, setMoreLoading] = useState(false);
  const [allTopics, setAllTopics] = useState<string[]>([]);
  const [selectedArray, setSelectedArray] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
 

  // Fetch topics from the API
  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      if (!res.ok) throw new Error("Failed to fetch topics");

      const data = await res.json();
      if (data.content) {
        const parsedTopics: string[] = JSON.parse(
          data.content.replace(/'/g, '"')
        ); // Parse the stringified array
        setAllTopics((prev) => [...new Set([...prev, ...parsedTopics])]); // Ensure uniqueness
      }
    } catch (error) {
      console.error("Failed to fetch topics:", error);
    }
  };

  // Fetch more topics
  const handleMoreTopics = async () => {
    setMoreLoading(true);
    await fetchTopics();
    setMoreLoading(false);
  };

  // Handle topic selection
  const toggleSelectTopic = (topic: string) => {
    setSelectedArray((prev) => {
      if (prev.includes(topic)) {
        // Remove if already selected
        return prev.filter((item) => item !== topic);
      } else {
        // Add to selectedArray
        return [...prev, topic];
      }
    });
  };
  const saveTopicsToDb = async () => {
    if (!user?.uid || selectedArray.length === 0) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/userdata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.uid,
          topics: selectedArray,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save topics");
      }

      const data = await response.json();
      console.log("Topics saved:", data);
    } catch (error) {
      console.error("Error saving topics:", error);
    } finally {
      setIsSaving(false);
      router.push('/article')
    }
  };
  // Render topics
  const renderTopics = () => {
    if (!allTopics.length) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto px-4">
        {allTopics.map((topic: string, index: number) => {
          const isSelected = selectedArray.includes(topic); // Check if selected
          return (
            <button
              key={index}
              onClick={() => toggleSelectTopic(topic)}
              className={`relative inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm text-white  ${
                isSelected
                  ? "button-gradient-hover" // Selected style
                  : "hover:button-gradient-hover" // Default style
              }`}
            >
              <span className="z-10">{topic}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
     <Header/>
      <main className="flex flex-col items-center py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-white">
          <Subtitle text="Which topics do you want to master this year?" />
        </h1>
        <>
          {renderTopics()}
          <button
            onClick={handleMoreTopics}
            disabled={moreLoading}
            className="mt-8 hover:button-gradient-hover relative inline-flex items-center justify-center rounded-lg px-8 py-3 text-xl text-black shadow-button button-border-gradient"
          >
            {moreLoading ? (
              <Spinner />
            ) : (
              <span className="z-10">
                {allTopics.length > 0 ? "More Topics" : "Get Topics"}
              </span>
            )}
          </button>
          {selectedArray.length > 0 && (
            <button
              onClick={saveTopicsToDb}
              disabled={isSaving}
              className="mt-8 hover:button-gradient-hover text-black relative inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm text-white shadow-button button-border-gradient"
            >
              {isSaving ? <Spinner /> : <span className="z-10">Save</span>}
            </button>
          )}
        </>
      </main>
    </div>
  );
};

export default Page;
