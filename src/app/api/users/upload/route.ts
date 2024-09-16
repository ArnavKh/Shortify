import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getSession } from "next-auth/react"; // Import getSession from next-auth

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY as string,
  },
  endpoint: `https://s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com`, // Ensure the correct endpoint
});

// Function to upload file to S3
async function uploadFileToS3(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
  videoName: string,
  tags: string
): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: `${fileName}-${Date.now()}`,
    Body: fileBuffer,
    ContentType: 'video/mp4', // Set the correct MIME type
    ACL: 'public-read', // Ensure correct ACL
    Metadata: {
      videoName: videoName, // Custom metadata
      tags: tags,
    },
  };

  // Log the params to ensure they are correct
  console.log("S3 upload parameters:", params);

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    return `https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${params.Key}`;
  } catch (err) {
    console.error("Error uploading to S3:", err); // Log detailed error
    throw new Error(`S3 upload failed`); // Throw error with detailed message
  }
}

// POST handler for file upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("videoFile") as File | null; // Adjusted to match form field name
    const videoName = formData.get("videoName") as string;
    const tags = formData.get("tags") as string;

    if (!videoFile) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Get the MIME type of the video file
    const contentType = videoFile.type || 'application/octet-stream'; // Default to binary stream if MIME type is not available

    const buffer = Buffer.from(await videoFile.arrayBuffer());
    const fileUrl = await uploadFileToS3(buffer, videoFile.name, contentType, videoName, tags);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Error in POST handler:", error); // Log errors in POST handler
    return NextResponse.json({ error: "Error uploading file"}, { status: 500 });
  }
}
