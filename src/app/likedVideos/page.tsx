"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LikedVideos() {
  const [likedVideoUrls, setLikedVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch liked video URLs when the component is mounted
  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get("/api/users/likedVideos");
        console.log("Fetched liked videos:", response.data.videos); // Log the data to check structure
        setLikedVideoUrls(response.data.videos); // Assuming response.data.videos is an array of URLs
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
      ) : likedVideoUrls.length === 0 ? (
        <p className="text-gray-400">You haven't liked any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {likedVideoUrls.map((videoUrl, index) => (
            <div key={index} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <video
                src={videoUrl}
                controls
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
