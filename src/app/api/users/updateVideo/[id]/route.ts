import { NextRequest, NextResponse } from 'next/server';
import Video from '@/models/videoModel';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const { Videoname, Tags } = await request.json();

  if (!Videoname || !Tags) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const video = await Video.findByIdAndUpdate(
      id,
      { Videoname, Tags },
      { new: true }
    );

    if (!video) {
      return NextResponse.json({ message: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
