import { getTenantHeaders } from "../../lib/auth";
import { FileText, Plus, Search, Filter, Download, MoreHorizontal, DollarSign } from "lucide-react";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

async function getInvoices() {
  try {
    const res = await fetch("http://localhost:3015/invoices", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch invoices");
    return res.json();
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }
}

export default async function InvoicesPage() {
  const invoices = await getInvoices();

  async function createInvoice(formData: FormData) {
    "use server";
    const amount = parseFloat(formData.get("amount") as string);
    if (!amount || isNaN(amount)) return;

    await fetch("http://localhost:3015/invoices", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-tenant-id": "default-tenant" 
      },
      body: JSON.stringify({ amount })
    });
    
    revalidatePath("/invoices");
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Invoices</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage billing, payments, and subscriptions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Filter size={16} />
            <span>Filter</span>
          </button>
          
          <form action={createInvoice} className="flex items-center space-x-2">
            <input 
              type="number" 
              name="amount" 
              placeholder="Amount..." 
              required
              className="w-24 bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
              <Plus size={16} />
              <span>New Invoice</span>
            </button>
          </form>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Total Outstanding</div>
          <div className="text-2xl font-semibold text-white">
            ${invoices.filter((i: any) => i.status !== 'PAID').reduce((sum: number, i: any) => sum + i.amount, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Overdue</div>
          <div className="text-2xl font-semibold text-rose-400">$0.00</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-400 mb-1">Paid (Last 30 Days)</div>
          <div className="text-2xl font-semibold text-emerald-400">
            ${invoices.filter((i: any) => i.status === 'PAID').reduce((sum: number, i: any) => sum + i.amount, 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
          </div>
        </div>
      </div>

      {/* Data Grid */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search invoices..." 
              className="pl-9 pr-4 py-1.5 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 w-64 transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Invoice #</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">No invoices found. Create one!</td>
                </tr>
              ) : invoices.map((invoice: any) => (
                <tr key={invoice.id} className="hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-zinc-100 font-medium">
                      <FileText size={16} className="text-zinc-500" />
                      <span>{invoice.invoiceNum}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-white">
                    ${invoice.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                      invoice.status === 'SENT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                      'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100 p-1 mr-2">
                      <Download size={16} />
                    </button>
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
