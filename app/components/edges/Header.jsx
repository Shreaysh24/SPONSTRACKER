"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";
import { LogOut, BadgePlus, MessageCircleMore, CircleUser, Menu,CalendarHeart ,BanknoteArrowUp  } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { data: session } = useSession();
  const [role, setRole] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      setRole(session.user.role || "user");
    }
  }, [session]);

  return (
    <header className="w-full bg-gradient-to-r top-0 fixed z-20 from-[#2d253a] to-[#3a2d4d] shadow-lg py-3 px-6 flex items-center justify-between">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/favicon.ico" alt="Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-2xl font-bold text-white tracking-wide">SponsTracker</span>
        </Link>
      </div>

      {/* Right: Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {session && (
          <>
            <Link href="/AllEvents" className="text-white text-sm font-bold hover:underline">
              Events
            </Link>
            <Link href="/AllSponsor" className="text-white text-sm font-bold hover:underline">
              Sponsor
            </Link>
          </>
        )}

        {session ? (
          <>
            <span className="text-white font-medium text-lg">Welcome, {session.user.name}!</span>

            <DropdownMenu>
              <DropdownMenuTrigger className="text-white font-bold cursor-pointer">
                <CircleUser />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <MessageCircleMore /> <Link href="/chats" className="ml-2">Inbox</Link>
                </DropdownMenuItem>
                {role === "user" && (
                  <DropdownMenuItem>
                    <BadgePlus /> <Link href="/registerevent" className="ml-2">Add Event</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut /> <span className="ml-2">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <span className="text-white font-medium">Want to Join?</span>
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

      {/* Mobile: Hamburger Menu */}
      <div className="md:hidden flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Menu className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {session && (
              <>
                <DropdownMenuItem>
                  <CalendarHeart  /><Link href="/AllEvents">Events</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BanknoteArrowUp /><Link href="/AllSponsor">Sponsor</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                   <MessageCircleMore /><Link href="/chats">Inbox</Link>
                </DropdownMenuItem>
                {role === "user" && (
                  <DropdownMenuItem>
                    <BadgePlus />  <Link href="/registerevent">Add Event</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()}> <LogOut />Logout</DropdownMenuItem>
              </>
            )}
            {!session && (
              <>
                <DropdownMenuItem>
                  <span>Want to Join?</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signIn()}>Sign in</DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
