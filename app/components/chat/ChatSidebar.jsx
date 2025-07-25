"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function ChatSidebar({ onSelectUser, selectedUser }) {
  const [contacts, setContacts] = useState([]);
  const { data: session } = useSession();
  const currentUser = session?.user;

  useEffect(() => {
    if (!currentUser?.email) return;

    const fetchContacts = async () => {
      const res = await fetch(`/api/fetchuser?user=${currentUser.email}`);
      const data = await res.json();
      setContacts(data.contacts);
    };

    fetchContacts();
  }, [currentUser]);

  return (
    <aside className="w-full mt-12 sm:w-72 bg-[#c7badd21] shadow-md border-r border-gray-200 h-screen p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Chats</h2>

      <div className="space-y-2 pr-2">
        {contacts.map((email) => {
          const name = email.split("@")[0];
          const initials = name[0]?.toUpperCase() || "U";
          const isSelected = selectedUser?.email === email;

          return (
            <div
              key={email}
              onClick={() => onSelectUser({ email, name })}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                isSelected ? "bg-blue-100" : "bg-gray-50 hover:bg-blue-50"
              }`}
            >
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full font-semibold">
                {initials}
              </div>
              <div className="text-sm text-gray-800">{name}</div>
            </div>
          );
        })}

        {contacts.length === 0 && (
          <p className="text-gray-500 text-sm text-center mt-6">No recent chats.</p>
        )}
      </div>
    </aside>
  );
}
