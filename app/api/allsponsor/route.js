import dbConnect from "@/lib/db";
import { Manager } from "@/Models/Manager";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const SponsLimit = parseInt(request.nextUrl.searchParams.get('limit'))||2;
        await dbConnect();
        const sponsors = await Manager.find({}).sort({ createdAt: -1 }).lean().limit(SponsLimit);

        if (!sponsors || sponsors.length === 0) {
            return NextResponse.json({ error: "No sponsors found" }, { status: 404 });
        }
        return NextResponse.json({ sponsors }, { status: 200 });
    } catch (error) {
        console.error("Error in getting Sponser:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}