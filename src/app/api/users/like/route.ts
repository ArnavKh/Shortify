import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Video from "@/models/videoModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Named export for POST request
export async function POST(request: NextRequest) {
  await connect(); // Connect to the MongoDB database

  try {
    const { videoId } = await request.json();
    const userId = await getDataFromToken(request);

    if (!userId) {
      return NextResponse.json({
        message: "UserId not found",
        status: 400,
      });
    }

    // Fetch user and video
    const user = await User.findById(userId);
    const video = await Video.findById(videoId);

    if (!user || !video) {
      return NextResponse.json({
        message: "User or Video not found",
        status: 400,
      });
    }

    // Toggle like status
    let likes;
    if (user.likedVideos.includes(video.VideoFile)) {
      // Remove from likedVideos
      user.likedVideos = user.likedVideos.filter((url:string) => url !== video.VideoFile);
      likes = video.Likes - 1;
    } else {
      // Add to likedVideos
      user.likedVideos.push(video.VideoFile);
      likes = video.Likes + 1;
    }

    // Update video likes and user likedVideos
    await user.save();
    await Video.findByIdAndUpdate(videoId, { Likes: likes });

    console.log("Updated likes:", likes); // Log to verify data

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    console.error("Error updating like status:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
