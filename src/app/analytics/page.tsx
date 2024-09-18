"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image";

interface Video {
    _id: string;
    Videoname: string;
    VideoFile: string; 
    Likes: number;
    CommentsEnglish: string[];
    CommentsHindi: string[];
    Tags: string[];
}

export default function analyticsPage(){
    const router = useRouter();
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [username, setusername] = React.useState("")


    useEffect(()=>{
        async function fetchUsername() {
            try{
                const response = await axios.post("/api/users/getUserdata")
                setVideos(response.data.videos);
                setusername(response.data.username)
            }catch(error){
                console.error("Error fetching username: ",error)
                toast.error("Failed to fetch user data");
            }
        }
        fetchUsername();
    },[])

    return (
        <main className="flex min-h-screen flex-col items-center bg-black text-white">
            {/* Header */}
            <div className="flex justify-between w-full p-4 bg-gray-900">
                <div className="flex items-center gap-5">
                    <Image
                        className="logo"
                        src="/logo.svg" // Replace with your logo or YouTube-like logo
                        alt="Logo"
                        width={100}
                        height={50}
                        
                    />
                    <h2>{username}</h2>
                </div>
                <nav className="flex space-x-8">
                    <Link href="/">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Home</button>
                    </Link>
                    <Link href="/profile">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">DashBoard</button>
                    </Link>
                    <Link href="/content">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Content</button>
                    </Link>
                    
                </nav>
            </div>
            <div className="w-full p-5 flex flex-col gap-6">
            {videos.length > 0 ? (
                videos.map((video) => (
                <div key={video._id} className="w-full bg-gray-800 p-4 rounded-lg relative flex items-center gap-4">
                    {/* Video thumbnail */}
                    <video
                    src={video.VideoFile}
                    controls
                    width="25%"
                    className="rounded-md"
                    />
                    {/* Video information */}
                    <div className="flex-1">
                    <h3 className="text-xl font-bold">{video.Videoname}</h3>
                    <p className="text-sm text-gray-400">Likes: {video.Likes}</p>
                    <p className="text-sm text-gray-400">Tags: {video.Tags.join(", ")}</p>
                    </div>
                </div>
                ))
            ) : (
                <p className="text-gray-400">No videos found.</p>
            )}
            </div>


        </main>
    )
}


























