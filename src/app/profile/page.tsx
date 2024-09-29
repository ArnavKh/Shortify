
"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import Header from "../header/header";
import Footer from "../footer/footer";
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

// Header Component
const handleLogout = () => {
    // Perform logout action here
    console.log('Logging out...');
};

export default function ProfilePage() {
    const router = useRouter();
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [username, setUsername] = React.useState("");
    const [videoSentiment, setVideoSentiment] = useState<Record<string, SentimentCounts>>({});



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

    const [videoData, setVideoData] = React.useState({
        videoName: "",
        tags: "",
        videoFile: null as File | null,
    });


    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);

    const onUpload = async () => {
        if (!videoData.videoFile || videoData.videoFile === null) {
            toast.error("Please select a video file ");
            return;
        }

        try {
            setLoading(true);

            // Prepare FormData for file upload
            const formData = new FormData();
            formData.append("videoName", videoData.videoName);
            formData.append("tags", videoData.tags);

            formData.append("videoFile", videoData.videoFile);

            const response = await axios.post("/api/users/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                toast.success("Uploaded Successfully!");
                router.push("/");  // Redirect to home after successful upload
            } else {
                toast.error("Upload failed. Please try again.");
            }

        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error("Upload failed: " + error.response?.data?.error || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (videoData.videoName.length > 0 && videoData.videoFile !== null) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [videoData]);

    const onLogout = async () => {
        try {
            await axios.get("/api/users/logout");
            toast.success("Logout successful");
            router.push("/login");
        } catch (error: any) {
            toast.error("Logout failed. Please try again.");
        }
    };


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
        <main className="flex min-h-screen flex-col bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">
            {/* Header */}

            <Header onLogout={onLogout} />

            {/* Upload Videos Section */}
            <div className="flex flex-col items-center justify-center h-auto lg:fixed lg:top-20 lg:left-0 lg:w-96 mt-[6rem] lg:mt-5 bg-secondary text-white p-5 lg:py-20 m-5 rounded-lg">
                <h1 className="text-3xl font-bold mb-6">
                    {loading ? "Processing..." : "Upload Video"}
                </h1>
                <form className="flex flex-col justify-center w-full max-w-md bg-secondary p-6 rounded-lg">
                    {/* Input for Video Name */}
                    <div className="mb-4">
                        {/* <label htmlFor="videoName" className="block text-sm font-medium">
                            Video Name
                        </label> */}
                        <input
                            type="text"
                            id="videoName"
                            value={videoData.videoName}
                            onChange={(e) =>
                                setVideoData({ ...videoData, videoName: e.target.value })
                            }
                            className="w-full p-2 border-b-2 border-gray-300 bg-secondary  focus:outline-none focus:border-[#F84E9D]"
                            placeholder="Video Name"
                            required
                        />
                    </div>

                    {/* Input Tags */}
                    <div className="mb-4">
                        {/* <label htmlFor="tags" className="block text-sm font-medium">
                            Tags
                        </label> */}
                        <input
                            type="text"
                            id="tags"
                            value={videoData.tags}
                            onChange={(e) =>
                                setVideoData({ ...videoData, tags: e.target.value })
                            }
                            className="w-full p-2 border-b-2 border-gray-300 bg-secondary  focus:outline-none focus:border-[#F84E9D]"
                            placeholder="Tags"
                            required
                        />
                    </div>


                    {/* Input for Video File */}
                    <div className="mb-4 cursor-pointer">
                        {/* Hidden File Input */}
                        <input
                            type="file"
                            id="videoFile"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files?.[0] || null;
                                setVideoData((prevState) => ({
                                    ...prevState,
                                    videoFile: file,
                                }));
                            }}
                            className="hidden" // Hides the input element
                            accept="video/*"
                            required
                        />

                        {/* Custom Button/Icon for Upload */}
                        <label htmlFor="videoFile" className="flex items-center justify-center cursor-pointer border-2 p-2 rounded-lg mt-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                            <p className="pl-2">Upload Video</p>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={onUpload}
                        disabled={buttonDisabled}
                        className={`w-full p-2 mt-4 text-white rounded-lg ${buttonDisabled
                            ? "bg-primary focus:outline-none cursor-not-allowed"
                            : "myGradient hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] focus:outline-none"
                            }`}
                    >

                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            </div>

            {/* Uploaded Videos Section */}
            <div className="lg:ml-[25.5rem] p-5 flex flex-col gap-6 lg:mt-[5rem]">
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <div key={video._id} className="bg-secondary p-4 rounded-lg h-auto flex">
                            {/* Video thumbnail */}
                            <div className="pr-6">

                                <video
                                    src={video.VideoFile}
                                    controls
                                    width={120}
                                    className="rounded-md"
                                />
                            </div>
                            <div className="w-[50%]">
                                {/* Video information */}
                                <div className="mt-3">
                                    <h3 className="text-xl font-bold">{video.Videoname}</h3>
                                    <p className="text-sm text-gray-400 font-bold">Likes: {video.Likes}</p>
                                    <p className="text-sm text-gray-400 font-bold">Tags: {video.Tags}</p>
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={() => deleteVideo(video._id)}
                                    className="px-4 py-2 mt-4 mr-2 bg-primary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]"
                                >
                                    Delete
                                </button>
                                <Link href={`/update/${video._id}`}>
                                    <button className="px-4 py-2 mt-4 ml-2 bg-primary rounded-md hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375]">
                                        Update
                                    </button>
                                </Link>
                            </div>

                            <div className="w-[50%]">
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
                <Footer />
            </div>
        </main>
    )
}
