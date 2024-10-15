import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/videoModel"; // Adjust path to your model
import { connect } from "@/dbConfig/dbConfig"; // Adjust path to your DB connection utility

// GET request handler
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Fetch all videos from the collection
    const videos = await Video.find().sort({ Likes: -1 }).limit(20);
    
    // Return the videos in JSON format
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
