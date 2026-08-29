import { getTenantHeaders } from "../../../lib/auth";
import Link from 'next/link';
import { Users, Building2, Mail, Phone, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getContacts() {
  try {
    const res = await fetch("http://localhost:3001/contacts", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch contacts");
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
          <p className="text-sm text-zinc-400 mt-1">Manage your customers and leads.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-400 bg-zinc-950 uppercase border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Company</th>
              <th className="px-6 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {contacts.map((contact: any) => (
              <tr key={contact.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    {contact.firstName[0]}
                  </div>
                  <Link href={`/contacts/${contact.id}`} className="hover:underline">
                    {contact.firstName} {contact.lastName}
                  </Link>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <Mail size={14} className="text-zinc-500" />
                    <span>{contact.email || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <Phone size={14} className="text-zinc-500" />
                    <span>{contact.phone || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  <div className="flex items-center space-x-2">
                    <Building2 size={14} className="text-zinc-500" />
                    <span>{contact.company?.name || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/contacts/${contact.id}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                  No contacts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
