import { getTenantHeaders } from "../../lib/auth";
import { DeveloperClient } from "./DeveloperClient";

export default async function DeveloperPage() {
  const [apiKeysRes, webhooksRes] = await Promise.all([
    fetch('http://localhost:3022/api-keys', { cache: "no-store", headers: await getTenantHeaders() }),
    fetch('http://localhost:3022/webhooks', { cache: "no-store", headers: await getTenantHeaders() })
  ]);

  const initialApiKeys = apiKeysRes.ok ? await apiKeysRes.json() : [];
  const initialWebhooks = webhooksRes.ok ? await webhooksRes.json() : [];

  return (
    <DeveloperClient initialApiKeys={initialApiKeys} initialWebhooks={initialWebhooks} />
  );
}
