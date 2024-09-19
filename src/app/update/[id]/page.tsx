"use client"
import React from "react"
import { useRouter} from "next/router"
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import axios from "axios";


interface Video{
    _id:String,
    Videoname:String;
    VideoFile:String;
    Tags:String[]
}

export default function UpdatePage(){
    const {id} = useParams();
    // const router = useRouter();
    const [video, setVideo] = useState<Video | null>(null);
    const [Videoname, setVideoname] = useState("")
    const [Tags, setTags] = useState<string[]>([]);
    

    useEffect(() => {
        const fetchVideo = async () => {
          try {
            const response = await axios.get(`/api/users/getVideo/${id}`);
            setVideo(response.data);
            if (response.data) {
              setVideoname(response.data.Videoname);
              setTags(response.data.Tags);
            }
          } catch (error) {
            console.error("Error fetching video:", error);
            toast.error("Failed to fetch video data.");
          }
        };
    
        fetchVideo();
      }, [id]);

      const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          await axios.put(`/api/users/updateVideo/${id}`, { Videoname,Tags });
          toast.success("Video updated successfully.");
        //   router.push("/profile");
        } catch (error) {
          console.error("Error updating video:", error);
          toast.error("Failed to update video.");
        }
      };
    
      if (!video) return <p>Loading...</p>;

    return (
        <main className="flex min-h-screen flex-col items-center bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">{video.Videoname}</h1>
      <form onSubmit={handleUpdate} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Video Name</label>
          <input
            type="text"
            value={Videoname}
            onChange={(e) => setVideoname(e.target.value)}
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Tags</label>
          <input
            type="text"
            value={Tags.join(", ")}
            onChange={(e) => setTags(e.target.value.split(",").map(tag => tag.trim()))}
            className="w-full p-2 mt-1 bg-gray-800 border border-gray-700 rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500 text-white"
        >
          Update Video
        </button>
      </form>
    </main>
    );
}