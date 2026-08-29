import { getTenantHeaders } from "../../lib/auth";
import { Plus, MoreHorizontal } from "lucide-react";
import { CreateDealModal } from "../../components/CreateDealModal";

export const dynamic = 'force-dynamic';

async function getDeals() {
  try {
    const res = await fetch('http://localhost:3005/deals', {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error("Error fetching deals:", error);
    return [];
  }
}

export default async function DealsPage() {
  const deals = await getDeals();

  const stages = [
    { title: "Lead", color: "border-zinc-500" },
    { title: "Meeting Scheduled", color: "border-blue-500" },
    { title: "Proposal", color: "border-purple-500" },
    { title: "Closed Won", color: "border-emerald-500" },
  ];

  const columns = stages.map(stage => ({
    ...stage,
    items: deals.filter((d: any) => d.stage === stage.title)
  }));

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Deals Pipeline</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage sales opportunities across the pipeline.</p>
        </div>
        <CreateDealModal />
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {columns.map((col, i) => (
          <div key={i} className="flex-shrink-0 w-80 flex flex-col">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${col.color}`}>
              <h3 className="font-medium text-zinc-200">{col.title}</h3>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{col.items.length}</span>
            </div>
            
            <div className="flex-1 flex flex-col gap-3 min-h-[100px] bg-zinc-900/30 rounded-xl p-2 border border-zinc-800/50 border-dashed">
              {col.items.map((item: any) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 cursor-grab hover:border-zinc-700 transition-colors shadow-sm group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-zinc-100">{item.title}</h4>
                    <button className="text-zinc-600 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                  <div className="text-xs text-zinc-500 mb-3">{item.company?.name || 'No Company'}</div>
                  <div className="text-sm font-semibold text-emerald-400">
                    ${Number(item.amount).toLocaleString()}
                  </div>
                </div>
              ))}
              <button className="flex items-center justify-center space-x-2 p-3 border border-zinc-800 border-dashed rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors mt-1">
                <Plus size={14} />
                <span>Add Deal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
