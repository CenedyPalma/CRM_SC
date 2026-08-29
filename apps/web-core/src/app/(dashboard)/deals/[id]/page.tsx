import { getTenantHeaders } from "../../../../lib/auth";
import { ActivityTimeline } from "../../../../components/crm/ActivityTimeline";
import { DollarSign, Building2, User, ArrowLeft, Calendar } from "lucide-react";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getDeal(id: string) {
  try {
    const res = await fetch(`http://localhost:3005/deals/${id}`, {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch deal");
    return res.json();
  } catch (error) {
    console.error("Error fetching deal:", error);
    return null;
  }
}

export default async function DealDetailPage({ params }: { params: { id: string } }) {
  const deal = await getDeal(params.id);

  if (!deal) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-zinc-400">Deal not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Back link */}
      <div>
        <Link href="/deals" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
          <ArrowLeft size={16} />
          <span>Back to Deals</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Deal Info */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                {deal.title}
              </h1>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-emerald-400 font-semibold text-lg">${Number(deal.amount).toLocaleString()}</span>
                <span className="text-zinc-600">•</span>
                <span className="text-indigo-400 text-sm font-medium">{deal.stage}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <Building2 size={16} className="text-zinc-500" />
                <span>{deal.company?.name || 'No Company Associated'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <User size={16} className="text-zinc-500" />
                <span>{deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : 'No Primary Contact'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <Calendar size={16} className="text-zinc-500" />
                <span>Created {new Date(deal.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="xl:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6 h-full">
            <h2 className="text-lg font-medium text-white mb-4">Deal Activity</h2>
            <ActivityTimeline entityType="deal" entityId={deal.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
