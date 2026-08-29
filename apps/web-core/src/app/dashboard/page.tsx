import { getTenantHeaders } from "../../lib/auth";
import { ArrowUpRight, Users, Briefcase, DollarSign, Activity, Settings } from "lucide-react";

async function getMetrics() {
  try {
    const res = await fetch("http://localhost:3013/metrics/dashboard", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch metrics");
    return res.json();
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return {
      revenue: "$0",
      revenueGrowth: "0%",
      activeUsers: 0,
      activeUsersGrowth: "0%",
      totalContacts: 0,
      contactsGrowth: "0%",
      activeWorkflows: 0,
      workflowsGrowth: "0%"
    };
  }
}

async function getActivity() {
  try {
    const res = await fetch("http://localhost:3013/metrics/activity", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch activity");
    return res.json();
  } catch (error) {
    console.error("Error fetching activity:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const data = await getMetrics();
  const activity = await getActivity();

  const kpis = [
    { title: "Total Revenue", value: data.revenue, trend: data.revenueGrowth, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Active Users", value: data.activeUsers, trend: data.activeUsersGrowth, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Total Contacts", value: data.totalContacts, trend: data.contactsGrowth, icon: Briefcase, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: "Active Workflows", value: data.activeWorkflows, trend: data.workflowsGrowth, icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  const iconMap: any = {
    "Deal": DollarSign,
    "Workflow": Settings,
    "Contact": Users,
    "AI": Activity
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-sm text-zinc-400 mt-1">Real-time metrics across your Business OS.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon size={20} className={kpi.color} />
              </div>
              <div className="flex items-center space-x-1 text-emerald-400 text-xs font-medium bg-emerald-500/10 px-2 py-1 rounded">
                <ArrowUpRight size={14} />
                <span>{kpi.trend}</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
              <div className="text-sm text-zinc-400 font-medium mt-1">{kpi.title}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-6">Revenue Growth (Q3)</h3>
          <div className="flex-1 flex items-end space-x-2">
            {[40, 55, 45, 70, 65, 85, 95, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-500/20 hover:bg-indigo-500/40 rounded-t-sm transition-colors relative group cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  ${(h * 10).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {activity.map((item: any) => {
              const Icon = iconMap[item.icon] || Activity;
              return (
                <div key={item.id} className="flex space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                      <Icon size={14} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-200 font-medium">{item.action}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-zinc-500">{item.user}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                      <span className="text-xs text-zinc-500">{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
