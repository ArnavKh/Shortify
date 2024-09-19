import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/videoModel";
import User from "@/models/userModel";

export async function POST(request: NextResponse) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { message: "Video ID is required" },
        { status: 400 }
      );
    }

    // Find the video to get the URL
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    const videoUrl = video.VideoFile;

    // Delete the video from the database
    await Video.findByIdAndDelete(videoId);

    // Fetch all users
    const users = await User.find();

    // Iterate over each user and check if the URL exists in their likedVideos array
    for (let user of users) {
      if (user.likedVideos.includes(videoUrl)) {
        // Remove the URL from their likedVideos array
        await User.findByIdAndUpdate(user._id, {
          $pull: { likedVideos: videoUrl },
        });
      }
    }

    return NextResponse.json({
      message: "Video deleted and removed from liked videos successfully",
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { message: "Error deleting video" },
      { status: 500 }
    );
  }
}
