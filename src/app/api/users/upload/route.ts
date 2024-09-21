import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Video from "@/models/videoModel"; 
import {connect} from "@/dbConfig/dbConfig"; 
import User from "@/models/userModel"

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY as string,
  },
  endpoint: `http://s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`, // Ensure correct endpoint
});

// Function to upload file to S3
async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  videoName: string,
  tags: string,
  userId: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: `videos/${Date.now()}_${fileName}`, // Organize files in an S3 folder
    Body: fileBuffer,
    ContentType: contentType, // Set correct MIME type
    ACL: 'public-read', // Ensure public access to the file URL
    Metadata: {
      videoName, // Custom metadata
      tags,
      userId,
    },
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `http://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${params.Key}`;
  } catch (err) {
    console.error("Error uploading to S3:", err); // Log detailed error
    throw new Error("S3 upload failed");
  }
}

// POST handler for video file upload
export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connect();

    // Get form data from the request
    const formData = await request.formData();
    const videoFile = formData.get("videoFile") as File | null;
    const videoName = formData.get("videoName") as string;
    const tags = formData.get("tags") as string;

    // Get the userId from the token (assumed to be provided by getDataFromToken)
    const userId = await getDataFromToken(request);

    // Validate file input
    if (!videoFile || !videoName || !tags) {
      return NextResponse.json({ error: "Video file, name, and tags are required" }, { status: 400 });
    }

    // Determine MIME type
    const contentType = videoFile.type || 'application/octet-stream'; // Default to binary stream if no MIME type
    
    // Convert file to buffer
    const buffer = Buffer.from(await videoFile.arrayBuffer());

    // Upload file to S3 and retrieve the file URL
    const fileUrl = await uploadFileToS3(buffer, videoFile.name, contentType, videoName, tags, userId);

    // Save video metadata and S3 URL to MongoDB
    const newVideo = new Video({
      Videoname: videoName,
      VideoFile: fileUrl, // S3 URL of the uploaded file
      Tags: tags, // Split tags by comma into an array
      UserId: userId, // User who uploaded the video
    });

    await newVideo.save(); // Save video document in MongoDB

    // Append video URL to user's uploadedVideos
    await User.findByIdAndUpdate(userId, {
      $push: { uploadedVideos: fileUrl }
    });

    // Return success response with the file URL and metadata
    return NextResponse.json({ success: true, fileUrl, video: newVideo });
  } catch (error) {
    console.error("Error in POST handler:", error); // Log error details
    return NextResponse.json({ error: "Error uploading file and saving to database" }, { status: 500 });
  }
}
