import { SuperAdminClient } from "./SuperAdminClient";

export default async function SuperAdminPage() {
  const res = await fetch('http://localhost:3021/tenants', { cache: 'no-store' });
  const initialTenants = res.ok ? await res.json() : [];

  return (
    <SuperAdminClient initialTenants={initialTenants} />
  );
}
