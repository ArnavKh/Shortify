//geting user info

import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server"
import User from "@/models/userModel"


export async function POST(request:NextRequest){
    const userId = await getDataFromToken(request);

    const user = await User.findById(userId);
    const username = user.username
    return NextResponse.json({username})
}