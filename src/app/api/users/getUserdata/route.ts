//geting user info

import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModel"
import Video from "@/models/videoModel";


interface VideoDocument {
    Videoname: string;
    VideoFile: string;
    Likes: number;
    Tags: string[];
    CommentsEnglish: string[];
    CommentsHindi: string[];
    UserId: string;
}

export async function POST(request:NextRequest){
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    
    const videoDetails = await Promise.all(
        user.uploadedVideos.map(async (videoUrl: string) => {
            try {
                return await Video.findOne({ VideoFile: videoUrl }) as VideoDocument | null;
            } catch (error) {
                console.error(`Error fetching video for URL: ${videoUrl}`, error);
                return null;
            }
        })
    );

    const validVideoDetails = videoDetails.filter((video): video is VideoDocument => video !== null);

    return NextResponse.json({
        username: user.username,
        videos: validVideoDetails
    });
}