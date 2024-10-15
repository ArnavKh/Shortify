"use client"
import React from "react"
import { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "../../header/header";
import Footer from "../../footer/footer";

const handleLogout = () => {
  // Perform logout action here
  console.log('Logging out...');
};

interface Video {
  _id: String,
  Videoname: String;
  VideoFile: String;
  Tags: String
}

export default function UpdatePage() {
  const router = useRouter();
  const { id } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [Videoname, setVideoname] = useState("")
  const [Tags, setTags] = useState("");


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
      await axios.put(`/api/users/updateVideo/${id}`, { Videoname, Tags });
      toast.success("Video updated successfully.");
      //   router.push("/profile");
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video.");
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

  if (!video) return <p>Loading...</p>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-primary text-white p-0 m-0 font-textFont transition-all duration-500 overflow-x-auto">

      <Header onLogout={onLogout} />

      <form onSubmit={handleUpdate} className="flex flex-col items-center justify-center h-auto mt-[10rem] bg-secondary text-white p-5 m-5 rounded-lg z-10 md:w-2/3 lg:w-2/5">
        <h1 className="w-full text-xl font-semibold text-wrap mb-16">{video.Videoname}</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Video Name</label>
          <input
            type="text"
            value={Videoname}
            onChange={(e) => setVideoname(e.target.value)}
            className="sm:w-96 p-2 border-b-2 border-gray-300 bg-secondary focus:outline-none focus:border-[#F84E9D]"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">Tags</label>
          <input
            type="text"
            value={Tags}
            onChange={(e) => setTags(e.target.value)}
            className="sm:w-96 p-2 border-b-2 border-gray-300 bg-secondary focus:outline-none focus:border-[#F84E9D]"
          />
        </div>

        <button type="submit" className="w-full p-2 mt-8 text-white rounded-lg myGradient hover:bg-gradient-to-tl hover:from-[#F84E9D] hover:to-[#FF7375] focus:outline-none">
          Update Video
        </button>
      </form>
      <Footer />
    </main>
  );
}