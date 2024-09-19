import { NextRequest, NextResponse } from 'next/server';
import Video from '@/models/videoModel';
import { ObjectId } from 'mongodb';


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  
  try {
    const video = await Video.findById(id);

    if (!video) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
