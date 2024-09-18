import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
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

    // Fetch the user and retrieve their likedVideos array
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        message: "User not found",
        status: 400,
      });
    }

    // Assuming likedVideos is an array of AWS S3 links
    const likedVideos = user.likedVideos;

    console.log("Liked videos:", likedVideos); // Log to verify data

    // Return the likedVideos array
    return NextResponse.json({ videos: likedVideos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching liked videos:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
