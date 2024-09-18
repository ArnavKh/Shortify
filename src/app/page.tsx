"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Video interface
interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string; // AWS URL
  Likes: number;
  CommentsEnglish: string[];
  CommentsHindi: string[];
}

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [likedVideoUrls, setLikedVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hindi">("English");
  const [commentTexts, setCommentTexts] = useState<{ [videoId: string]: string }>({});

  // Fetch videos and liked videos from the database
  useEffect(() => {
    const fetchVideosAndLikedStatus = async () => {
      try {
        // Fetch all videos
        const videoResponse = await axios.get("/api/users/videos");
        console.log("Fetched videos:", videoResponse.data.videos);
        setVideos(videoResponse.data.videos);

        // Fetch liked videos of the user (URLs)
        const likedVideosResponse = await axios.get("/api/users/likedVideos");
        console.log("Fetched liked videos:", likedVideosResponse.data.videos);
        setLikedVideoUrls(likedVideosResponse.data.videos || []);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos or liked videos:", error);
        setLoading(false);
      }
    };
    fetchVideosAndLikedStatus();
  }, []);

  // Handle like/dislike functionality
  const toggleLike = async (videoId: string, videoFileUrl: string) => {
    try {
      const response = await axios.post(`/api/users/like`, { videoId });
      console.log("Like response:", response.data);

      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? { ...video, Likes: response.data.likes }
            : video
        )
      );

      // Update liked videos state
      setLikedVideoUrls((prev) =>
        prev.includes(videoFileUrl)
          ? prev.filter((url) => url !== videoFileUrl) // Remove URL if already liked
          : [...prev, videoFileUrl] // Add URL if not liked
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Handle adding a comment
  const addComment = async (videoId: string, comment: string) => {
    try {
      const commentData = {
        videoId, // Add videoId to request body
        comment,
        language: selectedLanguage,
      };
      const updatedVideo = await axios.post(`/api/users/comment`, commentData); // Use the updated API endpoint
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? selectedLanguage === "English"
              ? { ...video, CommentsEnglish: updatedVideo.data.CommentsEnglish }
              : { ...video, CommentsHindi: updatedVideo.data.CommentsHindi }
            : video
        )
      );
      setCommentTexts((prev) => ({ ...prev, [videoId]: "" })); // Clear the comment input for the specific video
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.error("Logout failed", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-black text-white p-6">
      {/* Header */}
      <div className="flex justify-between w-full p-4 bg-gray-900">
        <div className="flex items-center">
          <Image
            src="/Logo.png" // Replace with your logo or YouTube-like logo
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
        <nav className="flex space-x-8">
          <Link href="/profile">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Profile</button>
          </Link>
          <div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
          <Link href="/trending">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Trending</button>
          </Link>
          <Link href="/likedVideos">
            <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Liked Videos</button>
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl mt-8">
        <h1 className="text-3xl font-bold mb-6">Recommended Videos</h1>
        {loading ? (
          <p>Loading videos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((video) => (
              <div key={video._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <video
                  src={video.VideoFile}
                  controls
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{video.Videoname}</h2>
                  <button
                    onClick={() => toggleLike(video._id, video.VideoFile)}
                    className={`px-4 py-2 rounded-md text-white mr-2 ${likedVideoUrls.includes(video.VideoFile) ? 'bg-red-500' : 'bg-blue-500'}`}
                  >
                    {likedVideoUrls.includes(video.VideoFile) ? 'Unlike' : 'Like'}
                  </button>

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <select
                      className="bg-gray-700 text-white mt-2 p-2 rounded"
                      onChange={(e) => setSelectedLanguage(e.target.value as "English" | "Hindi")}
                      value={selectedLanguage}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>

                    <ul className="mt-2">
                      {selectedLanguage === "English"
                        ? video.CommentsEnglish.map((comment, index) => (
                            <li key={index} className="text-gray-400">
                              {comment}
                            </li>
                          ))
                        : video.CommentsHindi.map((comment, index) => (
                            <li key={index} className="text-gray-400">
                              {comment}
                            </li>
                          ))}
                    </ul>

                    <input
                      type="text"
                      placeholder={`Add a comment in ${selectedLanguage}`}
                      className="bg-gray-700 text-white p-2 rounded w-full mt-2"
                      value={commentTexts[video._id] || ""}
                      onChange={(e) => setCommentTexts((prev) => ({ ...prev, [video._id]: e.target.value }))}
                    />
                    <button
                      onClick={() => {
                        const comment = commentTexts[video._id];
                        if (comment.trim()) {
                          addComment(video._id, comment);
                        }
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                      Submit Comment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full p-4 bg-gray-900 mt-12">
        <p className="text-center text-gray-500">© 2024 Your Website</p>
      </footer>
    </main>
  );
}
