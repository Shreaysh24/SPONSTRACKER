import dbConnect from "@/lib/db";
import Message from '@/Models/Message';
import { NextResponse } from "next/server";

export async function GET(req) {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const currentUserEmail = searchParams.get("user")?.toLowerCase();
    console.log('Fetching contacts for:', currentUserEmail);
    
    const chatPartners = await Message.aggregate([
        {
            $match: {
                participants: currentUserEmail,
            },
        },
        {
            $project: {
                otherUser: {
                    $filter: {
                        input: "$participants",
                        as: "email",
                        cond: { $ne: ["$$email", currentUserEmail] },
                    },
                },
            },
        },
        { $unwind: "$otherUser" },
        { $group: { _id: "$otherUser" } },
    ]);

    const contacts = chatPartners.map((partner) => partner._id);
    console.log("Contacts found:", contacts);
    return NextResponse.json({ contacts });
}
