export default function AuditLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Module Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center space-x-3">
          <h1 className="text-sm font-medium text-white">Security & Audit Logs</h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden p-6">
        {children}
      </main>
    </div>
  );
}
