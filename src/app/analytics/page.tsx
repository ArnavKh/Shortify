"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import SentimentBarChart from "@/components/sentimentBarChart";

interface Comment {
  username: string;
  comment: string;
}

interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string;
  Likes: number;
  CommentsEnglish: Comment[];
  CommentsHindi: Comment[];
  Tags: string[];
}

interface SentimentCounts {
  positive: number;
  neutral: number;
  negative: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [username, setUsername] = useState("");
  const [videoSentiment, setVideoSentiment] = useState<Record<string, SentimentCounts>>({});

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.post("/api/users/getUserdata");
        setVideos(response.data.videos);
        setUsername(response.data.username);

        for (const video of response.data.videos) {
          const englishComments = video.CommentsEnglish
            .filter((comment: Comment | null) => comment && comment.comment.trim() !== "")
            .map((comment: Comment) => comment.comment);
          const hindiComments = video.CommentsHindi
            .filter((comment: Comment | null) => comment && comment.comment.trim() !== "")
            .map((comment: Comment) => comment.comment);

          if (englishComments.length > 0 || hindiComments.length > 0) {
            const sentimentResponse = await fetch("/api/users/sentiments", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ englishComments, hindiComments }),
            });

            if (!sentimentResponse.ok) {
              throw new Error(`Failed to fetch sentiment analysis for video: ${video._id}`);
            }

            const sentimentData = await sentimentResponse.json();
            setVideoSentiment((prev) => ({ ...prev, [video._id]: sentimentData }));
          } else {
            setVideoSentiment((prev) => ({ ...prev, [video._id]: { positive: 0, neutral: 0, negative: 0 } }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data or sentiment analysis: ", error);
        toast.error("Failed to fetch data");
      }
    }

    fetchUserData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">


      {/* Video List with Video-wise Sentiment Analysis */}
      <div className="w-full p-5 flex flex-col gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} className="w-full bg-gray-800 p-4 rounded-lg relative flex flex-col md:flex-row gap-4 items-center">
              {/* Video thumbnail */}
              <video src={video.VideoFile} controls width="25%" className="rounded-md" />
              {/* Video information */}
              <div className="flex-1">
                <h3 className="text-xl font-bold">{video.Videoname}</h3>
                <p className="text-sm text-gray-400">Likes: {video.Likes}</p>
                <p className="text-sm text-gray-400">Tags: {video.Tags}</p>

                {/* Sentiment Analysis for this video */}
                {videoSentiment[video._id] ? (
                  <SentimentBarChart sentimentData={videoSentiment[video._id]} />
                ) : (
                  <p className="text-gray-400">Loading sentiment analysis...</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No videos found.</p>
        )}
      </div>
    </main>
  );
}
