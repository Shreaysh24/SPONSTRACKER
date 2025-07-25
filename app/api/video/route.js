import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { getServerSession } from "next-auth";
import { Event } from "@/Models/Event";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();
    // Parse skip and limit from query params
    const EventLimit = parseInt(request.nextUrl.searchParams.get('limit')) ;
   console.log('Fetching events with limit:', EventLimit);
    const events = await Event.find({}).limit(EventLimit).sort({ createdAt: -1 }).lean();
    if (!events || events.length === 0) {
      return NextResponse.json({ error: "No Event found" }, { status: 404 });
    }
    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error in video route:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body = await request.json();
    console.log("Request body:", body);
    if (!body.userEmail || !body.title || !body.description || !body.date || !body.location || !body.type || !body.amount || !body.stage || !body.videoUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const EventData = {
      ...body,
      controls: body.controls || false,
      transformation: {
        height: 720,
        width: 1280,
        quality: body.transformation?.quality || 80,
      },
    };
    const Res = await Event.create(EventData);
    return NextResponse.json({ message: "Event created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }
}