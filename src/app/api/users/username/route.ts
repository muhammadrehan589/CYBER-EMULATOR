import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[POST /api/users/username] session:", session);
    const empId = (session?.user as any)?.empId;
    if (!session || !empId) {
      return NextResponse.json({ success: false, error: "Unauthorized", sessionDebug: session }, { status: 401 });
    }

    const { username } = await req.json();
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return NextResponse.json({ success: false, error: "Invalid username" }, { status: 400 });
    }

    await connectDB();
    const dbUser = await User.findOne({ empId });
    if (!dbUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser && existingUser._id.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 409 });
    }

    if (dbUser.username === username) {
      return NextResponse.json({ success: true, data: { username } });
    }

    // Check cooldown
    const now = new Date();
    if (dbUser.lastUsernameChange) {
      const lastChange = new Date(dbUser.lastUsernameChange);
      const diffTime = Math.abs(now.getTime() - lastChange.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays <= 10) {
        return NextResponse.json({ success: false, error: `You cannot change your username for another ${11 - diffDays} days.` }, { status: 403 });
      }
    }

    dbUser.username = username;
    dbUser.lastUsernameChange = now;
    await dbUser.save();

    return NextResponse.json({ success: true, data: { username } });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
