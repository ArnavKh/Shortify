import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Video from "@/models/videoModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

// Named export for GET request
export async function GET(request: NextRequest) {
  await connect(); // Connect to the MongoDB database

  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({
        message: "UserId not found",
        status: 400,
      });
    }

    // Fetch the user to get their likedVideos array
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 400,
      });
    }

    // Fetch the videos that are in the likedVideos array
    const likedVideos = user.likedVideos;

    return NextResponse.json({ videos: likedVideos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
