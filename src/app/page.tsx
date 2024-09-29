"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Header from "./header/header";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "./footer/footer";

// Header Component
const handleLogout = () => {
  console.log('Logging out...');
};

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

export default function Home() {
  const router = useRouter();
  const [videos, setVideos] = useState<Video[]>([]);
  const [likedVideoUrls, setLikedVideoUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"English" | "Hindi">("English");
  const [commentTexts, setCommentTexts] = useState<{ [videoId: string]: string }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0); // Track the last scroll position
  const [scrolling, setScrolling] = useState(false); // Prevent continuous scrolling

  // State to control the visibility of the div
  const [isCommentVisible, setdisplayComment] = useState(false);
  const [isScreenSmall, setIsScreenSmall] = useState(false);

  // Function to toggle the visibility
  const toggleCommentVisibility = () => {
    if (isScreenSmall) {
      setdisplayComment((prevState) => !prevState);
    }
  };

  const checkScreenWidth = () => {
    if (window.innerWidth < 768) {
      setIsScreenSmall(true);
    } else {
      setIsScreenSmall(false);
    }
  };

  useEffect(() => {
    // Check the screen width on component mount
    checkScreenWidth();

    // Listen for window resize events
    window.addEventListener('resize', checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  const handleAutoplayAndFocus = () => {
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        const rect = video.getBoundingClientRect();
        const fullyInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (fullyInView) {
          video.currentTime = 0; // Reset video to the beginning
          video.play();
        } else {
          video.pause();
        }
      }
    });
  };

  const handleGlobalUnmute = () => {
    const newMuteState = !isGlobalMuted;
    setIsGlobalMuted(newMuteState);
    Object.values(videoRefs.current).forEach((video) => {
      if (video) {
        video.muted = newMuteState;
        if (!newMuteState && video.paused && video.currentTime > 0) {
          video.play(); // Play videos if they're paused and have been started
        }
      }
    });
  };

  useEffect(() => {
    const handleScroll = (event: WheelEvent) => {
      event.preventDefault(); // Prevent default scroll behavior

      // The amount you want to scroll (90vh)
      const scrollAmount = window.innerHeight * 0.925;
      const currentScroll = window.scrollY;

      if (!scrolling) {
        setScrolling(true); // Set scrolling state to prevent continuous scroll

        // Determine if user is scrolling up or down
        const scrollDirection = event.deltaY > 0 ? 'down' : 'up';

        if (scrollDirection === 'down') {
          window.scrollTo({
            top: currentScroll + scrollAmount,
            behavior: 'smooth',
          });
        } else {
          window.scrollTo({
            top: currentScroll - scrollAmount,
            behavior: 'smooth',
          });
        }

        setTimeout(() => setScrolling(false), 1000);
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => {
      window.removeEventListener('wheel', handleScroll); // Cleanup event listener
    };
  }, [scrolling]);

  useEffect(() => {
    window.addEventListener("scroll", handleAutoplayAndFocus); // Listen for scroll to trigger autoplay/focus behavior
    return () => {
      window.removeEventListener("scroll", handleAutoplayAndFocus);
    };
  }, []);

  useEffect(() => {
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


  const toggleLike = async (videoId: string, videoFileUrl: string) => {
    try {
      const response = await axios.post("/api/users/like", { videoId });
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

  const addComment = async (videoId: string, comment: string) => {
    try {
      const commentData = {
        videoId,
        comment,
        language: selectedLanguage,
      };
      const updatedVideo = await axios.post("/api/users/comment", commentData);
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
    <main className="flex min-h-screen flex-col items-center md:bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">
      <Header onLogout={onLogout} />

      <div className="w-full bg-primary flex flex-col items-center mt-16">
        {loading ? (
          <p className="text-xl mt-12 font-bold">Loading videos...</p>
        ) : (
          <div className="bg-primary w-auto h-auto flex flex-col items-center justify-center rounded-lg">


            {videos.map((video) => {
              return (
                <div
                  key={video._id}
                  className="bg-primary w-auto rounded-lg shadow-lg shadow-secondary overflow-x-auto mt-8 h-[90vh] flex justify-center items-center object-contain"
                >
                  {/* <div className="h-full"> */}
                  {!isCommentVisible || !isScreenSmall ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[video._id] = el;
                      }}
                      controls
                      autoPlay
                      muted={isGlobalMuted}
                      loop
                      className="h-full w-auto max-w-2xl object-contain rounded-lg"
                      src={video.VideoFile}
                    />
                  ):null}
                  {/* </div> */}

                  {/* Sidebar section */}
                  <div className="md:hidden p-2 flex flex-col bg-primary h-full justify-end">
                    <div className="flex flex-col">
                      {isCommentVisible ? ('') : (
                        <button
                          onClick={() => toggleLike(video._id, video.VideoFile)}
                          className={`py-2 ml-2 rounded-md text-white mr-2 ${likedVideoUrls.includes(video.VideoFile) ? "" : ""
                            }`}
                        >
                          {likedVideoUrls.includes(video.VideoFile) ? (
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
                          ) : (
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
                          )}
                          <p className="text-sm">{video.Likes}</p>
                        </button>
                      )}

                      {/* Comments */}
                      <button onClick={toggleCommentVisibility}>
                        {isCommentVisible ? (
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 ml-1">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                              />
                            </svg>
                            <p className="text-sm mt-1">{video.CommentsEnglish.length} | {video.CommentsHindi.length}</p>
                          </span>
                        ) : (
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 ml-2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                              />
                            </svg>
                            <p className="text-sm mt-1">{video.CommentsEnglish.length} | {video.CommentsHindi.length}</p>
                          </span>
                        )}
                      </button>


                      {/* Mute Button */}
                      <button
                        onClick={handleGlobalUnmute}
                        className="float-right ml-2 mt-3 p-2 rounded-md"
                      >
                        {isGlobalMuted ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none" className="size-6">
                            <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>


                  {/* PC View Sidebar */}
                  {isCommentVisible || !isScreenSmall ? (
                    <div className="p-4 round-lg flex flex-col justify-end h-full md:max-w-96">
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
                              fill="#FF7375"
                              stroke="#FF7375"
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
                              fill="none"
                              stroke="#ffffff"
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

                        <button
                          onClick={handleGlobalUnmute}
                          className="float-right mt-3 p-2 rounded-md"
                        >
                          {isGlobalMuted ? (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#FFFFFF" fill="none" className="size-6">
                              <path d="M14 14.8135V9.18646C14 6.04126 14 4.46866 13.0747 4.0773C12.1494 3.68593 11.0603 4.79793 8.88232 7.02192C7.75439 8.17365 7.11085 8.42869 5.50604 8.42869C4.10257 8.42869 3.40084 8.42869 2.89675 8.77262C1.85035 9.48655 2.00852 10.882 2.00852 12C2.00852 13.118 1.85035 14.5134 2.89675 15.2274C3.40084 15.5713 4.10257 15.5713 5.50604 15.5713C7.11085 15.5713 7.75439 15.8264 8.88232 16.9781C11.0603 19.2021 12.1494 20.3141 13.0747 19.9227C14 19.5313 14 17.9587 14 14.8135Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M18 10L22 14M18 14L22 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
                            </svg>

                          )}
                        </button>
                      </div>

                      {/* Comment Section */}
                      <div className="mt-4 flex flex-col justify-end">
                        <h3 className="text-lg font-semibold">Comments</h3>
                        <select
                          className="bg-secondary text-white my-2 p-2 rounded"
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
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main >
  );
}
