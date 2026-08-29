import React from 'react';
import { Shield, Plus, Lock, Users } from 'lucide-react';

export default function RolesAndPermissionsPage() {
  const roles = [
    { id: '1', name: 'Super Admin', description: 'Full access to all modules and settings.', isSystem: true, users: 2 },
    { id: '2', name: 'Sales Manager', description: 'Can view all deals and reports, manage reps.', isSystem: false, users: 5 },
    { id: '3', name: 'Sales Rep', description: 'Can only view and edit their own deals.', isSystem: false, users: 15 },
  ];

  const objects = ['Deals', 'Contacts', 'Companies', 'CustomObject_Vehicles'];
  const actions = ['Create', 'Read', 'Update', 'Delete'];

  return (
    <div className="p-6 h-full flex flex-col bg-slate-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="text-indigo-600" size={24} />
            Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage access control and define granular permissions.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus size={16} /> New Role
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Roles Sidebar */}
        <div className="col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Defined Roles</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {roles.map((role, idx) => (
              <div 
                key={role.id} 
                className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${idx === 1 ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold text-sm ${idx === 1 ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {role.name}
                  </h3>
                  {role.isSystem && (
                    <Lock size={12} className="text-slate-400" />
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mb-2">{role.description}</p>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Users size={12} /> {role.users} Users
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Matrix */}
        <div className="col-span-9 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sales Manager</h2>
                <p className="text-sm text-slate-500 mt-1">Configure object-level and field-level permissions for this role.</p>
              </div>
              <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium text-sm rounded-lg hover:bg-slate-200 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold text-slate-700">Module / Object</th>
                  {actions.map(action => (
                    <th key={action} className="px-6 py-4 font-semibold text-slate-700 text-center">{action}</th>
                  ))}
                  <th className="px-6 py-4 font-semibold text-slate-700">ABAC Conditions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {objects.map((obj) => (
                  <tr key={obj} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{obj}</td>
                    {actions.map(action => (
                      <td key={`${obj}-${action}`} className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 bg-white"
                          defaultChecked={obj !== 'CustomObject_Vehicles' || action === 'Read'}
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <select className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option>All Records</option>
                        <option>{`Owned Only (where ownerId = {{ userId }})`}</option>
                        <option>Team Only</option>
                        <option>Custom Condition...</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
