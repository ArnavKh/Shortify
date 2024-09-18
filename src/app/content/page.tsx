"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string;
  Likes: number;
  Tags: string[];
}

export default function ProfilePage() {
  const router = useRouter();
  const [videos, setVideos] = React.useState<Video[]>([]);
  const [username, setUsername] = React.useState("");

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await axios.post("/api/users/getUserdata");
        setVideos(response.data.videos);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
        toast.error("Failed to fetch user data");
      }
    }
    fetchUsername();
  }, []);

  const deleteVideo = async (videoId: string) => {
    try {
      await axios.post("/api/users/deleteVideo", { videoId });
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== videoId));
      toast.success("Video deleted successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white">
      {/* Header */}
      <div className="flex justify-between w-full p-4 bg-gray-900">
        <div className="flex items-center gap-5">
          <Image
            className="logo"
            src="/logo.svg"
            alt="Logo"
            width={100}
            height={50}
          />
          <h2 className="text-2xl font-semibold">{username}</h2>
        </div>
        <nav className="flex space-x-8">
          <Link href="/">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Home</button>
          </Link>
          <Link href="/profile">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Dashboard</button>
          </Link>
          <Link href="/content">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Content</button>
          </Link>
          <Link href="/trending">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Analytics</button>
          </Link>
        </nav>
      </div>

      {/* Uploaded Videos Section */}
      <div className="w-full p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} className="bg-gray-800 p-4 rounded-lg relative">
              {/* Video thumbnail */}
              <video
                src={video.VideoFile}
                controls
                width={300}
                height={150}
                className="rounded-md"
              />
              {/* Video information */}
              <div className="mt-3">
                <h3 className="text-xl font-bold">{video.Videoname}</h3>
                <p className="text-sm text-gray-400">Likes: {video.Likes}</p>
                <p className="text-sm text-gray-400">Tags: {video.Tags.join(", ")}</p>
              </div>
              {/* Delete button */}
              <button
                onClick={() => deleteVideo(video._id)}
                className="absolute top-2 right-2 px-2 py-1 bg-red-600 rounded-md hover:bg-red-500 text-white"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No videos found.</p>
        )}
      </div>
    </main>
  );
}
