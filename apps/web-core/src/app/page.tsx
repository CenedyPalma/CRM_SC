import { getTenantHeaders } from "../lib/auth";
import { MoreHorizontal, Filter, Download, Mail, Phone, Building } from "lucide-react";
import { CreateContactModal } from "../components/CreateContactModal";
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getContacts() {
  try {
    const res = await fetch('http://localhost:3001/contacts', {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error('Failed to fetch data');
    return res.json();
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Contacts</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage your business relationships and leads.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Download size={16} />
            <span>Export</span>
          </button>
          {/* We will route this to a real create page later, for now just a button */}
          <CreateContactModal />
        </div>
      </div>

      {/* Data Grid */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">No contacts found. Create one!</td>
                </tr>
              ) : contacts.map((contact: any) => (
                <tr key={contact.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-medium text-zinc-300 border border-zinc-700 uppercase">
                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                      </div>
                      <span className="font-medium text-zinc-100">{contact.firstName} {contact.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-300">
                    <div className="flex items-center space-x-2">
                      <Building size={14} className="text-zinc-500" />
                      <span>{contact.company?.name || 'No Company'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2 text-zinc-300">
                        <Mail size={12} className="text-zinc-500" />
                        <span className="text-xs">{contact.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-zinc-400">
                        <Phone size={12} className="text-zinc-500" />
                        <span className="text-xs">{contact.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
