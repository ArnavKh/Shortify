import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand, PutObjectCommandInput } from "@aws-sdk/client-s3";

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION as string,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY as string,
  },
  endpoint: https://s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com, // Ensure the correct endpoint
});

// Function to upload file to S3
async function uploadFileToS3(fileBuffer: Buffer, fileName: string): Promise<string> {
  const params: PutObjectCommandInput = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME as string,
    Key: ${ fileName }-${ Date.now() },
  Body: fileBuffer,
    ContentType: 'image/jpeg', // Adjust this based on the file type
      ACL: 'public-read', // Ensure correct ACL
  };

// Log the params to ensure they are correct
console.log("S3 upload parameters:", params);

const command = new PutObjectCommand(params);

try {
  await s3Client.send(command);
  return https://${params.Bucket}.s3.${process.env.NEXT_PUBLIC_AWS_S3_REGION}.amazonaws.com/${params.Key};
} catch (err) {
  console.error("Error uploading to S3:", err); // Log detailed error
  throw new Error(S3 upload failed); // Throw error with detailed message
}
}

// POST handler for file upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileUrl });
  } catch (error) {
    console.error("Error in POST handler:", error); // Log errors in POST handler
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}