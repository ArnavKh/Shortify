"use client";
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../header/header';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "../footer/footer";





// Header Component
const handleLogout = () => {
  // Perform logout action here
  console.log('Logging out...');
};


// Video interface
interface Comment {
  username: string;
  comment: string;
}

// Video interface
interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string;
  Likes: number;
  CommentsEnglish: Comment[];
  CommentsHindi: Comment[];
}


export default function TrendingVideos() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [likedVideoUrls, setLikedVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hindi">("English");
  const [commentTexts, setCommentTexts] = useState<{ [videoId: string]: string }>({});

  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({}); // Store references to videos
  const [scrollAmount, setScrollAmount] = useState(1000); // Fixed scroll amount in pixels
  const scrollContainerRef = useRef<HTMLDivElement | null>(null); // Ref to the scrollable container
  const isScrollingRef = useRef(false); // Ref to prevent multiple scrolls at once

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Prevent default scrolling behavior

      if (isScrollingRef.current) return; // Prevent multiple scrolls at once
      isScrollingRef.current = true;

      const container = scrollContainerRef.current;
      if (container) {
        // Determine scroll direction
        const scrollDirection = e.deltaY > 0 ? scrollAmount : -scrollAmount;

        container.scrollBy({
          top: scrollDirection,
          behavior: "smooth", // Smooth scroll effect
        });

        // Set a timeout to allow the scroll to finish before accepting new scrolls
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500); // Adjust the delay based on scroll behavior
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      // Attach the scroll listener
      container.addEventListener("wheel", handleWheel as EventListener, { passive: false });
    }

    return () => {
      if (container) {
        // Clean up the listener
        container.removeEventListener("wheel", handleWheel as EventListener);
      }
    };
  }, [scrollAmount]);

  const onLogout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      toast.error("Logout failed. Please try again.");
    }
  };

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

  // Handle like/dislike functionality
  const toggleLike = async (videoId: string, videoFileUrl: string) => {
    try {
      const response = await axios.post(`/api/users/like`, { videoId });
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId ? { ...video, Likes: response.data.likes } : video
        )
      );

      setLikedVideoUrls((prev) =>
        prev.includes(videoFileUrl)
          ? prev.filter((url) => url !== videoFileUrl)
          : [...prev, videoFileUrl]
      );
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  // Handle adding a comment
  const addComment = async (videoId: string, comment: string) => {
    try {
      const commentData = {
        videoId,
        comment,
        language: selectedLanguage,
      };
      const updatedVideo = await axios.post(`/api/users/comment`, commentData);
      setVideos((prevVideos) =>
        prevVideos.map((video) =>
          video._id === videoId
            ? selectedLanguage === "English"
              ? { ...video, CommentsEnglish: updatedVideo.data.CommentsEnglish }
              : { ...video, CommentsHindi: updatedVideo.data.CommentsHindi }
            : video
        )
      );
      setCommentTexts((prev) => ({ ...prev, [videoId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center overflow-hidden bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">
      {/* <div className="min-h-screen bg-gray-900 text-white p-8"> */}
      <Header onLogout={onLogout} />
      <h1 className="text-3xl font-bold mb-6">Trending Videos</h1>
      {loading ? (
        <p className="text-xl mt-12 font-bold">Loading videos...</p>
      ) : videos.length === 0 ? (
        <p className="text-gray-400">No trending videos available.</p>
      ) : (
        <div className="bg-primary w-auto h-auto flex flex-col items-center justify-center rounded-lg">
          {videos.map((video) => {
            return (
              <div
                key={video._id}
                className="bg-secondary w-auto rounded-lg shadow-lg overflow-x-auto mt-8 h-[90vh] flex justify-center items-center"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[video._id] = el; // Store reference without returning
                  }}
                  controls
                  loop
                  className="h-full w-auto max-w-2xl object-contain rounded-lg"
                  src={video.VideoFile}
                />

                {/* Video Sidebar */}
                <div className="p-4 flex flex-col justify-end h-full max-w-96">
                  <div>
                    <h2 className="text-xl font-semibold text-wrap">{video.Videoname}</h2>
                    <button
                      onClick={() => toggleLike(video._id, video.VideoFile)}
                      className={`py-2 m-auto rounded-md text-white mr-2 ${likedVideoUrls.includes(video.VideoFile) ? "" : ""
                        }`}
                    >
                      {likedVideoUrls.includes(video.VideoFile) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-heart w-10 m-auto"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#FF7375"
                          stroke="#FF7375"

                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-heart w-10 m-auto"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                      )}
                      <p className="text-sm">{video.Likes}</p>
                    </button>
                  </div>

                  {/* Comment Section */}
                  <div className="mt-4 flex flex-col justify-end">
                    <h3 className="text-lg font-semibold">Comments</h3>
                    <select
                      className="bg-primary text-white my-2 p-2 rounded"
                      onChange={(e) =>
                        setSelectedLanguage(e.target.value as "English" | "Hindi")
                      }
                      value={selectedLanguage}
                    >
                      <option value="English">English ({video.CommentsEnglish.length})</option>
                      <option value="Hindi">Hindi ({video.CommentsHindi.length})</option>
                    </select>

                    <ul className="mt-2 max-h-96 overflow-y-auto p-2 my-6 text-wrap">
                      {selectedLanguage === "English"
                        ? video.CommentsEnglish.map((commentObj, index) => (
                          <li key={index} className="text-white pt-2">
                            {commentObj.username}: <span className="text-gray-300">{commentObj.comment}</span>
                          </li>
                        ))
                        : video.CommentsHindi.map((commentObj, index) => (
                          <li key={index} className="text-white pt-2">
                            {commentObj.username}: <span className="text-gray-300">{commentObj.comment}</span>
                          </li>
                        ))}
                    </ul>

                    <div>
                      <input
                        type="text"
                        placeholder={`Add a comment in ${selectedLanguage}`}
                        className="w-full p-2 border-b-2 border-gray-300  bg-secondary focus:outline-none focus:border-[#F84E9D]"
                        value={commentTexts[video._id] || ""}
                        onChange={(e) =>
                          setCommentTexts((prev) => ({
                            ...prev,
                            [video._id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => {
                          const comment = commentTexts[video._id];
                          if (comment.trim()) {
                            addComment(video._id, comment);
                          }
                        }}
                        className="w-full p-2 mt-2 rounded-md myGradient hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] active:scale-95 focus:outline-none"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* </div> */}
      <Footer />
    </main>
  );
}