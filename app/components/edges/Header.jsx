"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { LogOut, BadgePlus, MessageCircleMore, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
export default function Header() {
    const { data: session } = useSession();
    const [role, setRole] = useState("");
    useEffect(() => {
        if (session && session.user) {
            setRole(session.user.role || "user");
        }
    }, [session]);
    return (
        <header className="w-full p-10 bg-gradient-to-r top-0 fixed z-10 from-[#2d253a] to-[#3a2d4d] shadow-lg py-3 px-6 flex items-center justify-between">
            {/* Left: Logo and App Name */}
            <div>
                <div className="flex items-center gap-8 flex-row">
                    <div  >
                        <Link href="/" className="flex items-center gap-3">
                            <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="rounded-lg" />
                            <span className="text-2xl font-bold text-white tracking-wide">SponsTracker</span>
                        </Link>
                    </div>
                    {session && (
                        <>
                            <div className="text-white text-sm cursor-pointer font-bold mt-2">
                                <Link href='AllEvents'>Events</Link>
                            </div>
                            <div className="text-white text-sm cursor-pointer font-bold mt-2">
                                <Link href='AllSponsor'>Sponsor</Link>
                            </div>
                        </>
                    )}
                </div>

            </div>
            {/* Right: User Info and Auth Buttons */}
            <div className="flex  items-center gap-4">
                {session ? (
                    <>
                        <span className="text-white font-medium text-lg">
                            Welcome, {session.user.name} !
                        </span>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="font-bold cursor-pointer m-0 text-white"><CircleUser /></DropdownMenuTrigger>
                            <DropdownMenuContent className={"m-0"}>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <MessageCircleMore /> <Link href='/chats'>Inbox</Link>
                                </DropdownMenuItem>
                                {role == "user" && (
                                    <DropdownMenuItem className={"m-0"}><BadgePlus />
                                        <Link href="/registerevent">Add Event</Link>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => signOut()}>     <LogOut />Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <>
                        <span className="text-white font-medium">Want to Join ?</span>
                        <Button
                            variant="outline"
                            className="border-white text-white bg-transparent hover:bg-[#7c4dff] hover:text-white"
                            onClick={() => signIn()}
                        >
                            Sign in
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}