import { getTenantHeaders } from "../../../../lib/auth";
import { ActivityTimeline } from "../../../../components/crm/ActivityTimeline";
import { Building2, Mail, Phone, ArrowLeft, DollarSign } from "lucide-react";
import Link from 'next/link';
import { WhatsAppButton } from "../../../../components/crm/WhatsAppButton";

export const dynamic = 'force-dynamic';

async function getContact(id: string) {
  try {
    const res = await fetch(`http://localhost:3001/contacts/${id}`, {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch contact");
    return res.json();
  } catch (error) {
    console.error("Error fetching contact:", error);
    return null;
  }
}

async function getKhataBalance(contactId: string) {
  try {
    const res = await fetch(`http://localhost:3015/khata/balance/${contactId}`, {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch balance");
    return res.json();
  } catch (error) {
    console.error("Error fetching Khata balance:", error);
    return { balance: 0, status: 'UNKNOWN' };
  }
}

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const contact = await getContact(params.id);
  const khata = await getKhataBalance(params.id);

  if (!contact) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-zinc-400">Contact not found.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Back link */}
      <div>
        <Link href="/contacts" className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
          <ArrowLeft size={16} />
          <span>Back to Contacts</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Contact Info & Ledger */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-bold">
                {contact.firstName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white tracking-tight">
                  {contact.firstName} {contact.lastName}
                </h1>
                <p className="text-zinc-400 text-sm mt-1">Lead</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <Mail size={16} className="text-zinc-500" />
                <span>{contact.email || '-'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <Phone size={16} className="text-zinc-500" />
                <span>{contact.phone || '-'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-300">
                <Building2 size={16} className="text-zinc-500" />
                <span>{contact.company?.name || 'No Company'}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <WhatsAppButton contactId={contact.id} phone={contact.phone} />
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white flex items-center"><DollarSign size={18} className="text-emerald-500 mr-2" /> Khata Ledger</h2>
            </div>
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
              <div className="text-sm text-zinc-400 mb-1">Current Balance</div>
              <div className={`text-2xl font-bold ${khata.balance < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                {khata.balance < 0 ? '-' : ''}${Math.abs(khata.balance).toFixed(2)}
              </div>
              {khata.dueSince && (
                <p className="text-xs text-zinc-500 mt-2">Due since: {new Date(khata.dueSince).toLocaleDateString()}</p>
              )}
            </div>
            <button className="w-full mt-4 py-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-md text-sm font-medium transition-colors">
              Record Payment
            </button>
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="xl:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden p-6 h-full">
            <h2 className="text-lg font-medium text-white mb-4">Universal Timeline</h2>
            <p className="text-sm text-zinc-400 mb-6">Merged view of notes, calls, WhatsApp, and Khata payments.</p>
            <ActivityTimeline entityType="contact" entityId={contact.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
