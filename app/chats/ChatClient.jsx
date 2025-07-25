// // /app/chats/ChatClient.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import ChatSidebar from "../components/chat/ChatSidebar";
// import ChatWindow from "../components/chat/ChatWindow";
// import { useSession } from "next-auth/react";

// export default function ChatClient() {
//   const { data: session } = useSession();
//   const [selectedUser, setSelectedUser] = useState(null);
//   const searchParams = useSearchParams();
//   const selectedUserEmail = searchParams.get("user");

//   useEffect(() => {
//     if (!selectedUserEmail) return;
//     setSelectedUser({ email: selectedUserEmail });
//   }, [selectedUserEmail]);

//   return (
//     <div className="flex h-screen top fixed w-full">
//       <ChatSidebar
//         selectedUser={selectedUser}
//         onSelectUser={setSelectedUser}
//       />
//       {selectedUser ? (
//         <ChatWindow selectedUser={selectedUser} />
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-gray-400">
//           Select a user to start chatting
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { useSession } from "next-auth/react";

export default function ChatClient() {
  const { data: session } = useSession();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const searchParams = useSearchParams();
  const selectedUserEmail = searchParams.get("user");

  useEffect(() => {
    if (selectedUserEmail) {
      setSelectedUser({ email: selectedUserEmail });
    }
  }, [selectedUserEmail]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // < sm
    };
    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen fixed w-full top-0">
      {/* Show contact list on desktop or when no user is selected on mobile */}
      {(isMobile ? !selectedUser : true) && (
        <div className="w-full sm:w-72">
          <ChatSidebar
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        </div>
      )}

      {/* Show chat on desktop or when user is selected on mobile */}
      {(isMobile ? !!selectedUser : true) && (
        <div className="flex-1">
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              onBack={() => setSelectedUser(null)} // Back for mobile
            />
          ) : (
            <div className="hidden sm:flex flex-1 items-center justify-center text-gray-400">
              Select a user to start chatting
            </div>
          )}
        </div>
      )}
    </div>
  );
}
