import { getTenantHeaders } from "../../lib/auth";
import { Ticket, Plus, Search, Filter, MessageSquare, Clock, AlertCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

async function getTickets() {
  try {
    const res = await fetch("http://localhost:3016/tickets", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }
}

export default async function TicketsPage() {
  const tickets = await getTickets();

  async function createTicket(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    if (!title) return;

    await fetch("http://localhost:3016/tickets", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-tenant-id": "default-tenant" 
      },
      body: JSON.stringify({ title, description, priority })
    });
    
    revalidatePath("/tickets");
  }

  async function updateTicketStatus(id: string, status: string) {
    "use server";
    await fetch(`http://localhost:3016/tickets/${id}/status`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "x-tenant-id": "default-tenant" 
      },
      body: JSON.stringify({ status })
    });
    revalidatePath("/tickets");
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Support Tickets</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage and resolve customer support requests.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          
          <form action={createTicket} className="flex items-center space-x-2 bg-zinc-900 border border-zinc-800 rounded-md p-1 pl-2">
            <input 
              type="text" 
              name="title" 
              placeholder="New ticket subject..." 
              required
              className="w-48 bg-transparent text-sm text-white focus:outline-none placeholder-zinc-500"
            />
            <input type="hidden" name="description" value="Opened from dashboard." />
            <select name="priority" className="bg-zinc-800 text-zinc-300 text-sm rounded px-2 py-1 outline-none border-none">
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
            <button type="submit" className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded transition-colors flex items-center">
              <Plus size={16} className="mr-1" /> Create
            </button>
          </form>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Open Tickets</div>
          <div className="text-2xl font-semibold text-white">
            {tickets.filter((t: any) => t.status === 'OPEN').length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Pending</div>
          <div className="text-2xl font-semibold text-amber-400">
            {tickets.filter((t: any) => t.status === 'PENDING').length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Resolved</div>
          <div className="text-2xl font-semibold text-emerald-400">
            {tickets.filter((t: any) => t.status === 'RESOLVED').length}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Avg Resolution Time</div>
          <div className="text-2xl font-semibold text-white">2.4 hrs</div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              className="pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 w-64 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {tickets.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">No tickets found in the queue.</div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {tickets.map((ticket: any) => (
                <div key={ticket.id} className="p-4 hover:bg-zinc-800/50 transition-colors flex items-start justify-between group">
                  <div className="flex space-x-4">
                    <div className="mt-1">
                      {ticket.status === 'RESOLVED' ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Ticket size={16} />
                        </div>
                      ) : ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? (
                        <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                          <AlertCircle size={16} />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <Ticket size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-zinc-100 font-medium">{ticket.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          ticket.priority === 'HIGH' || ticket.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-400' :
                          ticket.priority === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm mt-1 line-clamp-1">{ticket.description}</p>
                      <div className="flex items-center space-x-4 mt-3 text-xs text-zinc-500 font-medium">
                        <span className="flex items-center space-x-1">
                          <span className="text-zinc-600">ID:</span>
                          <span>{ticket.id.slice(-6)}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock size={12} />
                          <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageSquare size={12} />
                          <span>{ticket.messages?.length || 0} messages</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {ticket.status !== 'RESOLVED' && (
                      <form action={async () => {
                        "use server";
                        await updateTicketStatus(ticket.id, "RESOLVED");
                      }}>
                        <button type="submit" className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded transition-colors">
                          Resolve
                        </button>
                      </form>
                    )}
                    <button className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded transition-colors">
                      View Thread
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
