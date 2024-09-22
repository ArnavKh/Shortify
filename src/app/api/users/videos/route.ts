import { NextRequest, NextResponse } from "next/server";
import Video from "@/models/videoModel"; // Adjust path to your model
import { connect } from "@/dbConfig/dbConfig"; // Adjust path to your DB connection utility

// GET request handler
export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connect();

    // Get the total number of videos
    const totalVideos = await Video.countDocuments();

    // Use the $sample aggregation to randomly fetch all videos
    const videos = await Video.aggregate([{ $sample: { size: totalVideos } }]);

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
