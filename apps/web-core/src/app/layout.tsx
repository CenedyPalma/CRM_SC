import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import { Activity, Code2, ShieldAlert, Folder, LayoutDashboard, Users, Building, Briefcase, Settings, Search, Database, Brain, MessageSquare, DollarSign, Ticket, ClipboardList, Contact, UploadCloud } from "lucide-react";
import { GlobalSearch } from "../components/GlobalSearch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Business OS",
  description: "Enterprise Business Operating System",
};

import { AskAICopilot } from "../components/AskAICopilot";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 flex h-screen overflow-hidden antialiased`} suppressHydrationWarning>
        {/* Navigation Sidebar */}
        <nav className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
          <div className="p-4 flex items-center space-x-2 border-b border-zinc-800">
            <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center text-white font-bold">
              OS
            </div>
            <span className="font-semibold text-lg tracking-tight">Business OS</span>
          </div>
          <div className="p-4 flex-1 space-y-1 overflow-y-auto">
            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-4 px-2">Core</div>
            <a href="/dashboard" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><LayoutDashboard size={18} /><span>Dashboard</span></a>
            <a href="/" className="flex items-center space-x-3 px-2 py-2 bg-indigo-500/10 text-indigo-400 rounded-md transition-colors"><Users size={18} /><span>Contacts</span></a>
            <a href="/deals" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Briefcase size={18} /><span>Deals Pipeline</span></a>
            <a href="/projects" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><ClipboardList size={18} /><span>Projects</span></a>
            <a href="/invoices" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><DollarSign size={18} /><span>Invoices</span></a>
            <a href="/tickets" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Ticket size={18} /><span>Helpdesk</span></a>
            <a href="/directory" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Contact size={18} /><span>Directory</span></a>

            <a href="/documents" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Folder size={18} /><span>Documents</span></a>

            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-6 px-2">Extensions</div>
            <a href="/subscriptions" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><DollarSign size={18} /><span>Subscriptions</span></a>
            <a href="/slas" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Settings size={18} /><span>SLAs</span></a>
            <a href="/reports" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Activity size={18} /><span>Reports</span></a>
            <a href="/e-signatures" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><ClipboardList size={18} /><span>E-Signatures</span></a>
            <a href="/compliance" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><ShieldAlert size={18} /><span>Compliance</span></a>
            <a href="/taxes" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><DollarSign size={18} /><span>Taxes</span></a>
            <a href="/onboarding" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Users size={18} /><span>Onboarding</span></a>

            <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 mt-6 px-2">Engines</div>
            <Link href="/platform/schema" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              <Database size={18} />
              <span>Schema Builder</span>
            </Link>
            <Link href="/platform/ai" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              <Brain size={18} />
              <span>AI Engine</span>
            </Link>
            <Link href="/smart-upload" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors">
              <UploadCloud size={18} />
              <span>Smart Ingestion</span>
            </Link>
            <a href="/chat" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><MessageSquare size={18} /><span>Team Chat</span></a>
            <a href="/automations" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Settings size={18} /><span>Automations</span></a>
            <a href="/marketplace" className="flex items-center space-x-3 px-2 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-md transition-colors"><Building size={18} /><span>App Marketplace</span></a>
          </div>
          <div className="p-4 border-t border-zinc-800">
            <a href="#" className="flex items-center space-x-3 px-2 py-2 text-zinc-400 hover:text-white transition-colors"><Settings size={18} /><span>Settings</span></a>
          </div>
        </nav>
        
        {/* Main Workspace Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 relative">
          {/* Topbar */}
          <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50 backdrop-blur-sm z-10">
            <div className="flex items-center text-sm font-medium text-zinc-400">
              CRM <span className="mx-2 text-zinc-600">/</span> <span className="text-zinc-100">Contacts</span>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium text-white shadow-md cursor-pointer ring-2 ring-zinc-950">
                JD
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>

          <AskAICopilot />
        </main>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
