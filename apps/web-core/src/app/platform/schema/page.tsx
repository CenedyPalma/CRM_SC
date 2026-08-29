import { getTenantHeaders } from "../../../lib/auth";
import { SchemaBuilderClient } from "./SchemaBuilderClient";

export default async function SchemaPage() {
  const res = await fetch('http://localhost:3008/custom-objects', {
    headers: await getTenantHeaders(),
    cache: 'no-store'
  });
  const customObjects = await res.json();

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="border-b border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Schema Builder</h1>
        <p className="text-slate-500">Visually build and manage custom database objects and fields.</p>
      </div>
      <div className="flex-1 overflow-hidden p-6">
        <SchemaBuilderClient initialObjects={customObjects} />
      </div>
    </div>
  );
}
