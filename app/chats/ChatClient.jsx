// /app/chats/ChatClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useSession } from "next-auth/react";

export default function ChatClient() {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);
  const searchParams = useSearchParams();
  const selectedUserEmail = searchParams.get("user");

  useEffect(() => {
    if (!selectedUserEmail) return;
    setSelectedUser({ email: selectedUserEmail });
  }, [selectedUserEmail]);

  return (
    <div className="flex h-screen top fixed w-full">
      <ChatSidebar
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      {selectedUser ? (
        <ChatWindow selectedUser={selectedUser} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Select a user to start chatting
        </div>
      )}
    </div>
  );
}
