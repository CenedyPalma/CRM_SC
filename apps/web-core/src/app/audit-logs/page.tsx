import { getTenantHeaders } from "../../lib/auth";
import { AuditLogsClient } from "./AuditLogsClient";

export default async function AuditLogsPage() {
  const res = await fetch('http://localhost:3023/logs', { cache: "no-store", headers: await getTenantHeaders() });
  const initialLogs = res.ok ? await res.json() : [];

  return (
    <AuditLogsClient initialLogs={initialLogs} />
  );
}
