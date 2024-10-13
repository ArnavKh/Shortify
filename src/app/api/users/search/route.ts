import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig"; // Database connection
import Video from "@/models/videoModel"; // Your Video model
import { getDataFromToken } from "@/helpers/getDataFromToken"; // Function to extract user data from token

// Named export for GET request
export async function GET(request: NextRequest) {
  await connect(); // Connect to the MongoDB database

  try {
    // Extract the search query parameter
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    // If no search term is provided, return an error
    if (!searchTerm) {
      return NextResponse.json({
        message: "Please provide a video name or tags to search",
        status: 400,
      });
    }

    // Split the search term into parts (name and tags)
    const searchTerms = searchTerm.split(",").map(term => term.trim());

    // Build the MongoDB query object
    const query: any = {
      $or: [
        { Videoname: { $regex: searchTerms.join("|"), $options: "i" } }, // Match video name (using regex for partial matches)
        { Tags: { $in: searchTerms } } // Match tags
      ]
    };

    // Fetch the videos matching the search criteria from MongoDB
    const videos = await Video.find(query);

    // If no videos are found, return a 404 response
    if (videos.length === 0) {
      return NextResponse.json({
        message: "No videos found",
        status: 404,
      });
    }

    console.log("Found videos:", videos); // Log the search result

    // Return the found videos in the response
    return NextResponse.json({ videos }, { status: 200 });
  } catch (error) {
    console.error("Error searching for videos:", error);
    return NextResponse.json(
      { message: "Internal Server Error", status: 500 },
      { status: 500 }
    );
  }
}
