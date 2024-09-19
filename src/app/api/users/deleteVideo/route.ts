import {NextRequest, NextResponse} from "next/server"
import Video from "@/models/videoModel"

export async function POST(request:NextResponse){
    try{
        const {videoId} = await request.json();
        if (!videoId) {
            return NextResponse.json({ message: "Video ID is required" }, { status: 400 });
        }

        await Video.findByIdAndDelete(videoId);
        return NextResponse.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("Error deleting video:", error);
        return NextResponse.json({ message: "Error deleting video" }, { status: 500 });
  }
    
}