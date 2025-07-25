import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Manager } from "@/Models/Manager";
import { User } from "@/Models/User";


export async function POST(request) {
    try {
        const body = await request.json();
        // const chatClient = StreamChat.getInstance("{{ api_key }}", {
        //     timeout: 6000,
        // });
        // chatClient.connectUser(
        //     {
        //         id: "john",
        //         name: "John Doe",
        //         image: "https://getstream.io/random_svg/?name=John",
        //     },
        //     "{{ chat_user_token }}",
        // );
        const { name, email, password, role } = body;
        if (!name || !email || !password || !role) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (role !== "Manager" && role !== "User") {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        await dbConnect();
        const existingUser = await User.findOne({ email }) || await Manager.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }
        if (role === "Manager") {
            const { companyName, companyDomain, contactNumber, amount } = body;
            if (!companyName || !companyDomain || !contactNumber || !amount) {
                return NextResponse.json({ error: "All fields are required for Manager registration" }, { status: 400 });
            }
            const newManager = new Manager({
                name,
                email,
                password,
                companyName,
                companyDomain,
                contactNumber,
                amount,
                stage: "Opened",
            });
            await newManager.save();
        } else if (role === "User") {
            const newUser = new User({
                name,
                email,
                password,
            });
            await newUser.save();
        }



      


        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json(
        { message: "GET not supported on this route. Use POST." },
        { status: 405 }
    );
}
