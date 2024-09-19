"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Video interface
interface Comment {
  username: string;
  comment: string;
}

interface Video {
  _id: string;
  Videoname: string;
  VideoFile: string; // AWS URL
  Likes: number;
  CommentsEnglish: Comment[];
  CommentsHindi: Comment[];
}

export default function Home() {
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

  useEffect(() => {
    // Fetch videos and liked videos from the database
    const fetchVideosAndLikedStatus = async () => {
      try {
        const videoResponse = await axios.get("/api/users/videos");
        setVideos(videoResponse.data.videos);

        const likedVideosResponse = await axios.get("/api/users/likedVideos");
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
    <main className="flex min-h-screen flex-col items-center bg-primary text-white p-0 m-0 font-textFont transition-all duration-500">
      {/* Header */}
      <div className="flex justify-between w-full p-4 bg-primary fixed z-50">
        <div className="flex items-center">
          <Image src="/Logo.png" alt="Logo" width={50} height={50} />
        </div>
        <nav className="flex space-x-8">
          <Link href="/profile">
            <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
              Profile
            </button>
          </Link>
          <Link href="">
            <button onClick={onLogout} className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
              Log Out
            </button>
          </Link>
          <Link href="/trending">
            <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
              Trending
            </button>
          </Link>
          <Link href="/likedVideos">
            <button className="px-4 py-2 bg-secondary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
              Liked Videos
            </button>
          </Link>
        </nav>
      </div>

      {/* Content */}
      <div className="w-full h-full overflow-auto flex flex-col items-center mt-24">
        {loading ? (
          <p>Loading videos...</p>
        ) : (
          <div className="w-full max-w-screen-sm h-full flex flex-col items-center">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-secondary rounded-lg overflow-hidden shadow-lg mb-8 w-full h-[90vh] flex justify-center items-center"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[video._id] = el; // Store reference without returning
                  }}
                  controls
                  loop
                  className="h-full w-auto max-w-full object-contain"
                  src={video.VideoFile}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{video.Videoname}</h2>
                  <button
                    onClick={() => toggleLike(video._id, video.VideoFile)}
                    className={`px-4 py-2 rounded-md text-white mr-2 ${likedVideoUrls.includes(video.VideoFile) ? "bg-red-500" : "bg-blue-500"
                      }`}
                  >
                    {likedVideoUrls.includes(video.VideoFile) ? "Unlike" : "Like"}
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
                        ? video.CommentsEnglish.map((commentObj, index) => (
                          <li key={index} className="text-gray-400">
                            {commentObj.username}: {commentObj.comment}
                          </li>
                        ))
                        : video.CommentsHindi.map((commentObj, index) => (
                          <li key={index} className="text-gray-400">
                            {commentObj.username}: {commentObj.comment}
                          </li>
                        ))}
                    </ul>

                    <input
                      type="text"
                      placeholder={`Add a comment in ${selectedLanguage}`}
                      className="bg-gray-700 text-white p-2 rounded w-full mt-2"
                      value={commentTexts[video._id] || ""}
                      onChange={(e) =>
                        setCommentTexts((prev) => ({ ...prev, [video._id]: e.target.value }))
                      }
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