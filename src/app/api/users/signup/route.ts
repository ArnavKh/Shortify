import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

connect();

// function for post request....
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { username, email, password } = requestBody;
    console.log(requestBody);

    // check if the user already exists
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // hash the password...
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create new user...
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // now storing in the database
    const savedUser = await newUser.save();
    console.log(savedUser);

    // returning the response of new user created...
    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
