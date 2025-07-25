// /app/api/messages/route.js (Next.js 13+ App Router)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/Models/Message';

export async function POST(req) {
  try {
    await dbConnect();

    const { sender, receiver, content, participants } = await req.json();

    if (!sender || !receiver || !content || !participants) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const message = await Message.create({
      sender,
      receiver,
      content,
      participants: [sender, receiver].sort()
    });
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const sender = searchParams.get('user1').toLowerCase();
    const receiver = searchParams.get('user2').toLowerCase();

    if (!sender || !receiver) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    const messages = await Message.find({
      participants: { $all: [sender, receiver] }
    }).sort({ timestamp: 1 });
    console.log("Fetching messages:of ", sender, " and ", receiver);
    return NextResponse.json({ messages });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

