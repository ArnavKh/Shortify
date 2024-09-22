// src/app/api/users/recommend/route.ts
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import axios from 'axios';

const API_BASE_URL_RECOMMEND = 'http://127.0.0.1:5002/recommendations';

export async function GET(req: NextRequest) {
    const userId = await getDataFromToken(req);
    console.log(userId);

    if (!userId || Array.isArray(userId)) {
        return NextResponse.json({ error: 'User ID is required and must be a single value' }, { status: 400 });
    }

    try {
        const response = await axios.get(`${API_BASE_URL_RECOMMEND}/${userId}`);
        console.log(response.data.recommended_videos)
        return NextResponse.json(response.data.recommended_videos);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
    }
}
