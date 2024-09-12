import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    // Extract the token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      throw new Error("JWT token is missing");
    }

    // Verify and decode the token
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    // Return the user id or other data from the token
    return decodedToken.id; // Adjust based on the actual structure of your token payload
  } catch (error: any) {
    throw new Error(error.message);
  }
};
