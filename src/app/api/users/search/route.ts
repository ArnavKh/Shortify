import { connect } from "@/dbConfig/dbConfig";
import Video from "@/models/videoModel"; // Adjust path to your model
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    await connect();

    // Get the URLSearchParams from the request URL
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q'); // Get the search query

    if (!q) {
        return NextResponse.json({ message: 'Query parameter is required.' }, { status: 400 });
    }

    try {
        const results = await Video.find({
            $or: [
                { Videoname: { $regex: q, $options: 'i' } },
                { Tags: { $regex: q, $options: 'i' } }
            ]
        });
        console.log(results);
        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error('Error fetching search results:', error);
        return NextResponse.json({ message: 'Error fetching search results.' }, { status: 500 });
    }
}
