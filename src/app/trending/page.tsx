"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Video interface
interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string;
  Likes: number;
  CommentsEnglish: string[];
  CommentsHindi: string[];
}

export default function TrendingVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the top 20 trending videos
  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await axios.get("/api/users/trending");
        setVideos(response.data.videos);  // Assuming response contains the video data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending videos:", error);
        setLoading(false);
      }
    };
    fetchTrendingVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Trending Videos</h1>
      {loading ? (
        <p className="text-gray-400">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No trending videos available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <video
                src={video.VideoFile}
                controls
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{video.Videoname}</h2>
                <p className="text-gray-400">{video.Likes} likes</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
