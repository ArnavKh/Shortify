import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import mongoose from "mongoose";
import Grid from "gridfs-stream";
import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { Readable } from "stream";
import Video from "@/models/videoModel";
import crypto from "crypto";
import path from "path";
import GridFsStorage from "multer-gridfs-storage";
// import { Db } from "mongodb";

// MongoDB connection
let gfs: any;
let gridfsBucket: any;

async function initGridFS() {
  const connection = mongoose.connection;

  // Ensure the connection is ready before accessing the DB
  if (connection.readyState !== 1) {
    await new Promise<void>((resolve, reject) => {
      connection.once("open", resolve);
      connection.on("error", reject);
    });
  }

  // Check if GridFS has already been initialized
  if (!gfs && connection.db) {
    const db = connection.getClient().db(); // Get the MongoDB Db instance
    gridfsBucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads",
    });
    gfs = Grid(connection.db, mongoose.mongo);
    gfs.collection("uploads"); // Define the collection for GridFS
  }
}

const storage = new GridFsStorage({
  url: process.env.MONGO_URL!,
  file: (req: any, file: any) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = { filename: filename, bucketName: "uploads" };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

export async function POST(request: NextRequest) {
  try {
    await connect(); // Connect to the DB
    await initGridFS(); // Initialize GridFS

    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    const formData = await request.formData();
    const videoName = formData.get("videoName") as string;
    const videoFile = formData.get("videoFile") as File;

    if (!videoName || !videoFile) {
      return NextResponse.json(
        { error: "Please provide videoName and videoFile" },
        { status: 400 }
      );
    }

    if (!gfs) {
      throw new Error("GridFS not initialized");
    }

    const buffer = await videoFile.arrayBuffer();
    const fileStream = Readable.from(Buffer.from(buffer));

    // Create a write stream for GridFS
    const uploadStream = gridfsBucket.openUploadStream(videoName, {
      metadata: { userId },
    });
    fileStream.pipe(uploadStream);

    return new Promise<NextResponse>((resolve, reject) => {
      uploadStream.on("finish", async () => {
        const fileId = uploadStream.id.toString();

        const newVideo = new Video({
          videoName,
          videoFile: fileId,
          Likes: 0,
          Tags: [],
          Comments: [],
          UserId: userId,
        });

        try {
          const savedVideo = await newVideo.save();
          resolve(
            NextResponse.json({
              message: "Video uploaded successfully",
              success: true,
              savedVideo,
            })
          );
        } catch (saveError) {
          reject(
            NextResponse.json(
              { error: "Failed to save video" },
              { status: 500 }
            )
          );
        }
      });

      uploadStream.on("error", (err: any) => {
        reject(
          NextResponse.json(
            { error: "Failed to upload video" },
            { status: 500 }
          )
        );
      });
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
