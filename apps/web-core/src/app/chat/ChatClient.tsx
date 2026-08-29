"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Hash, User as UserIcon } from "lucide-react";

export function ChatClient({ channels, initialMessages }: { channels: any[], initialMessages: any[] }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [input, setInput] = useState("");
  const activeChannel = channels[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hardcode a mock user for the demo since auth context isn't fully wired to this component yet
  const currentUser = { id: "user-1", firstName: "Admin", lastName: "User" };

  useEffect(() => {
    // Connect to the Chat Microservice (Port 3014)
    const newSocket = io("/api/chat");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      if (activeChannel) {
        newSocket.emit("joinChannel", { channelId: activeChannel.id });
      }
    });

    newSocket.on("newMessage", (message: any) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket || !activeChannel) return;

    socket.emit("sendMessage", {
      channelId: activeChannel.id,
      userId: currentUser.id, // we would normally get this from session
      content: input,
    });

    setInput("");
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold tracking-tight">Team Chat</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-2">Channels</div>
          {channels.map((ch) => (
            <button
              key={ch.id}
              className={`w-full flex items-center space-x-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeChannel?.id === ch.id ? "bg-indigo-500/10 text-indigo-400" : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              }`}
            >
              <Hash size={16} className="opacity-70" />
              <span>{ch.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-900">
        {/* Chat Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center px-6">
          <div className="flex items-center space-x-2 text-white font-medium">
            <Hash size={18} className="text-zinc-500" />
            <span>{activeChannel?.name || "Select a channel"}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="text-center text-zinc-500 py-10">No messages yet. Start the conversation!</div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700">
                    {msg.user?.firstName?.[0] || <UserIcon size={18} />}
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-zinc-200">
                      {msg.user?.firstName ? `${msg.user.firstName} ${msg.user.lastName}` : 'Anonymous'}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-1">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/50">
          <form onSubmit={sendMessage} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message #${activeChannel?.name || "..."}`}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-4 pr-12 py-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="absolute right-2 p-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-md transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
