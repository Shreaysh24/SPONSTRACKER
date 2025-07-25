// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useSession } from "next-auth/react";
// import {
//   initPubNub,
//   sendMessagePubNub,
//   subscribeToChannel,
// } from "@/lib/usePubNub";

// export default function ChatWindow({ selectedUser }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const { data: session } = useSession();

//   const currentUser = session?.user;
//   const sender = currentUser?.email;
//   const receiver = selectedUser?.email;
//   const channel = sender && receiver ? [sender, receiver].sort().join("_") : "";

//   // 1. Initialize PubNub
//   useEffect(() => {
//     if (sender) initPubNub(sender);
//   }, [sender]);

//   // 2. Scroll to latest message
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // 3. Fetch old chat
//   useEffect(() => {
//     if (!sender || !receiver) return;

//     const fetchChat = async () => {
//       try {
//         const res = await fetch(`/api/messages?user1=${sender}&user2=${receiver}`);
//         const data = await res.json();
//         setMessages(data.messages);
//       } catch (error) {
//         console.error("Failed to fetch chat:", error);
//       }
//     };

//     fetchChat();
//   }, [sender, receiver]);

//   // 4. Subscribe for new messages
//   useEffect(() => {
//     if (!sender || !channel) return;

//     const unsubscribe = subscribeToChannel(channel, (newMsg) => {
//       setMessages((prev) => [...prev, newMsg]);
//     }, sender);

//     return () => {
//       if (unsubscribe) unsubscribe();
//     };
//   }, [channel, sender]);

//   // 5. Send message
//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const messageObj = {
//       sender,
//       receiver,
//       content: input,
//       participants: [sender, receiver],
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await sendMessagePubNub(channel, messageObj);

//       await fetch("/api/messages", {
//         method: "POST",
//         body: JSON.stringify(messageObj),
//         headers: { "Content-Type": "application/json" },
//       });

//       setInput("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };
//   const initials = selectedUser?.name || selectedUser?.email?.[0].toUpperCase() || "U";

//   return (
//     <div className=" flex-1 flex flex-col h-[100%]">
//       {/* TOPBAR */
//       }
      
//       <div className="mt-14 bg-[#c7baddca] text-white p-4 shadow flex items-center justify-between">
//         <h2 className="text-lg font-semibold bg-[#d690e5ed] rounded-full w-10 h-10 flex items-center justify-center">
//           {initials}
//         </h2>
//         {/* Optional: Add call or settings icons */}
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
//         {messages.length > 0 ? (
//           messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`mb-2 flex ${
//                 msg.sender === sender ? "justify-end" : "justify-start"
//               }`}
//             >
//               <span
//                 className={`inline-block px-4 py-2 text-sm rounded-lg ${
//                   msg.sender === sender
//                     ? "bg-[#3a2d4d] text-white"
//                     : "bg-[#ad9cc8b5] text-gray-800 border"
//                 }`}
//               >
//                 {msg.content}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500 text-center mt-10">No messages yet</p>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT */}
//       <div className="p-4 bg-white border-t flex items-center">
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="flex-1 border rounded-l-md p-2 focus:outline-none"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={handleSend}
//           className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { LogOut} from "lucide-react";
import {
  initPubNub,
  sendMessagePubNub,
  subscribeToChannel,
} from "@/lib/usePubNub";

export default function ChatWindow({ selectedUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const { data: session } = useSession();

  const currentUser = session?.user;
  const sender = currentUser?.email;
  const receiver = selectedUser?.email;
  const channel = sender && receiver ? [sender, receiver].sort().join("_") : "";

  useEffect(() => {
    if (sender) initPubNub(sender);
  }, [sender]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!sender || !receiver) return;

    const fetchChat = async () => {
      try {
        const res = await fetch(`/api/messages?user1=${sender}&user2=${receiver}`);
        const data = await res.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      }
    };

    fetchChat();
  }, [sender, receiver]);

  useEffect(() => {
    if (!sender || !channel) return;

    const unsubscribe = subscribeToChannel(channel, (newMsg) => {
      setMessages((prev) => [...prev, newMsg]);
    }, sender);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [channel, sender]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const messageObj = {
      sender,
      receiver,
      content: input,
      participants: [sender, receiver],
      timestamp: new Date().toISOString(),
    };

    try {
      await sendMessagePubNub(channel, messageObj);

      await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify(messageObj),
        headers: { "Content-Type": "application/json" },
      });

      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const initials = selectedUser?.name || selectedUser?.email?.[0]?.toUpperCase() || "U";

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* TOP BAR */}
      <div className="mt-14 bg-[#c7baddca] text-white p-4 shadow flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back Button (Only on mobile) */}
          {onBack && (
            <button
              onClick={onBack}
              className="sm:hidden bg-transparent text-black px-3 py-1 rounded"
            >
               <LogOut />
            </button>
          )}
          <div className="text-lg font-semibold bg-[#d690e5ed] rounded-full w-10 h-10 flex items-center justify-center">
            {initials}
          </div>
          <span className="text-sm font-medium text-black ml-2">{selectedUser?.name}</span>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex ${
                msg.sender === sender ? "justify-end" : "justify-start"
              }`}
            >
              <span
                className={`inline-block px-4 py-2 text-sm rounded-lg ${
                  msg.sender === sender
                    ? "bg-[#3a2d4d] text-white"
                    : "bg-[#ad9cc8b5] text-gray-800 border"
                }`}
              >
                {msg.content}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 bg-white border-t flex items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-md p-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
}

