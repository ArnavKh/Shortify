
"use client"
import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image";


export default function ProfilePage() {
    const router = useRouter()
    const [data, setData] = React.useState("")

    const [username, setusername] = React.useState("")


    useEffect(()=>{
        async function fetchUsername() {
            try{
                const response = await axios.post("/api/users/getUserdata")
                setusername(response.data.username)
            }catch(error){
                console.error("Error fetching username: ",error)
                toast.error("Failed to fetch user data");
            }
        }
        fetchUsername();
    },[])
    
    const [videoData, setVideoData] = React.useState({
        videoName: "",
        tags:"",
        videoFile: null as File | null,
      });
    
      
      const [buttonDisabled, setButtonDisabled] = React.useState(true);
      const [loading, setLoading] = React.useState(false);
    
      const onUpload = async () => {
        if (!videoData.videoFile ||videoData.videoFile === null) {
          toast.error("Please select a video file ");
          return;
        }
    
        try {
          setLoading(true);
    
          // Prepare FormData for file upload
          const formData = new FormData();
          formData.append("videoName", videoData.videoName);
          formData.append("tags",videoData.tags);
          
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
                    <Link href="/analytics">
                        <button className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600">Analytics</button>
                    </Link>
                </nav>
            </div>

            <div>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-3xl font-bold mb-6">
                    {loading ? "Processing..." : "Upload Video"}
                </h1>
                <form className="w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
                    {/* Input for Video Name */}
                    <div className="mb-4">
                    <label htmlFor="videoName" className="block text-sm font-medium">
                        Video Name
                    </label>
                    <input
                        type="text"
                        id="videoName"
                        value={videoData.videoName}
                        onChange={(e) =>
                        setVideoData({ ...videoData, videoName: e.target.value })
                        }
                        className="w-full p-2 mt-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                        placeholder="Enter the video name"
                        required
                    />
                    </div>

                    {/* Input Tags */}
                    <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium">
                        Tags
                    </label>
                    <input
                        type="text"
                        id="tags"
                        value={videoData.tags}
                        onChange={(e) =>
                        setVideoData({ ...videoData, tags: e.target.value })
                        }
                        className="w-full p-2 mt-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                        placeholder="Enter the video name"
                        required
                    />
                    </div>


                    {/* Input for Video File */}
                    <div className="mb-4">
                    <label htmlFor="videoFile" className="block text-sm font-medium">
                        Upload Video
                    </label>
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
                        className="w-full p-2 mt-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500"
                        accept="video/*" // Ensure only video files are selected
                        required
                    />
                    </div>

                    {/* Submit Button */}
                    <button
                    type="button"
                    onClick={onUpload}
                    disabled={buttonDisabled}
                    className={`w-full p-2 mt-4 text-white rounded-lg ${
                        buttonDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    >
                    {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>
                </div>
            </div>
        </main>  
    )
}
