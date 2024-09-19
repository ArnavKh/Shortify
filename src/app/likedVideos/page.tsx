"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Header from "../header/header";

// Header Component
const handleLogout = () => {
  // Perform logout action here
  console.log('Logging out...');
};

export default function LikedVideos() {
  const router = useRouter();
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

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">
      <Header onLogout={onLogout} />

      <h1 className="text-3xl font-bold mb-6 mt-24">Liked Videos</h1>
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
                className="w-full max-w-sm h-full object-contain rounded-t-lg"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
