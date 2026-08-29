import { getTenantHeaders } from "../../lib/auth";
import { ChatClient } from "./ChatClient";

async function getChannels() {
  try {
    const res = await fetch("http://localhost:3014/chat/channels", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch channels");
    return res.json();
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
}

export default async function ChatPage() {
  const channels = await getChannels();
  const initialMessages = channels.length > 0 ? channels[0].messages.reverse() : [];

  return (
    <div className="h-full">
      <ChatClient channels={channels} initialMessages={initialMessages} />
    </div>
  );
}
