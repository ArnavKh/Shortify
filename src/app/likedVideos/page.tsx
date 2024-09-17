"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface Video {
  id: string;
  title:string;
  likes:Number;
  url: string;
  description: string;
}

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch liked videos when the component is mounted
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get("/api/users/likedVideos");
        setLikedVideos(response.data.videos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching liked videos:", error);
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Liked Videos</h1>
      {loading ? (
        <p>Loading...</p>
      ) : likedVideos.length === 0 ? (
        <p className="text-gray-400">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedVideos.map((video) => (
            <div key={video.id} className="bg-gray-800 rounded-lg shadow-md">
              <img
                
                
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{video.title}</h2>
                <p className="text-gray-400">{video.description}</p>
                <a
                  href={video.url}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Video
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
