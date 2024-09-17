import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Video from "@/models/videoModel";
import User from "@/models/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(request: NextRequest) {
  try {
    await connect();

    // Get request data
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Get user ID from the token
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Find the video and user
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the video is already liked by the user
    const isLiked = user.likedVideos.includes(video.VideoFile);

    if (isLiked) {
      // User is trying to dislike the video
      video.Likes -= 1; // Decrement Likes
      user.likedVideos = user.likedVideos.filter(
        (url: string) => url !== video.VideoFile
      ); // Remove URL from likedVideos
    } else {
      // User is trying to like the video
      video.Likes += 1; // Increment Likes
      user.likedVideos.push(video.VideoFile); // Add URL to likedVideos
    }

    // Save updates to video and user
    await video.save();
    await user.save();

    return NextResponse.json({ likes: video.Likes });
  } catch (error) {
    console.error("Error handling like/dislike:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
