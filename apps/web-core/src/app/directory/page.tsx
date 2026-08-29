import { getTenantHeaders } from "../../lib/auth";
import { Users, Mail, Building2, Calendar, Briefcase, Plus } from "lucide-react";

export const dynamic = 'force-dynamic';

async function getEmployees() {
  try {
    const res = await fetch("http://localhost:3018/hr/employees", {
      headers: await getTenantHeaders(),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error("Failed to fetch employees");
    return res.json();
  } catch (error) {
    console.error("Error fetching employees:", error);
    return [];
  }
}

export default async function DirectoryPage() {
  const employees = await getEmployees();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Employee Directory</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage team members and organizational structure.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-colors flex items-center space-x-2">
            <Plus size={16} />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
        {employees.map((employee: any) => (
          <div key={employee.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors shadow-sm group">
            <div className="p-5 flex flex-col items-center text-center border-b border-zinc-800/50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white mb-3 shadow-inner">
                {employee.firstName[0]}{employee.lastName[0]}
              </div>
              <h3 className="text-lg font-medium text-white group-hover:text-indigo-400 transition-colors">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-sm text-indigo-400 font-medium mt-1">{employee.jobTitle || 'No Title'}</p>
            </div>
            
            <div className="p-4 bg-zinc-950/50 flex flex-col space-y-3">
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <Mail size={16} className="text-zinc-500" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <Building2 size={16} className="text-zinc-500" />
                <span>{employee.department?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-zinc-400">
                <Calendar size={16} className="text-zinc-500" />
                <span>Joined {new Date(employee.startDate).toLocaleDateString()}</span>
              </div>
            </div>

            {employee.leaveRequests && employee.leaveRequests.length > 0 && (
              <div className="p-4 border-t border-zinc-800/50 bg-zinc-900">
                <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent Leave</div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-300">{employee.leaveRequests[0].type}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                    employee.leaveRequests[0].status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                    employee.leaveRequests[0].status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {employee.leaveRequests[0].status}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {employees.length === 0 && (
          <div className="col-span-full p-12 text-center border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
            No employees found in the directory.
          </div>
        )}
      </div>
    </div>
  );
}
