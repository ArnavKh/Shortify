import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Video from "@/models/videoModel";
import User from "@/models/userModel"
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { videoId, comment, language } = await req.json();

    if (!videoId || !comment || !language) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const userId = getDataFromToken(req);
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const username = user.username;
    
    // Find the video by ID
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    // Add the comment to the appropriate language array
    if (language === "English") {
      video.CommentsEnglish.push({ username, comment });
    } else if (language === "Hindi") {
      video.CommentsHindi.push({ username, comment });
    } else {
      return NextResponse.json(
        { message: "Invalid language" },
        { status: 400 }
      );
    }

    // Save the updated video
    await video.save();

    // Respond with the updated video
    return NextResponse.json(
      {
        CommentsEnglish: video.CommentsEnglish,
        CommentsHindi: video.CommentsHindi,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
