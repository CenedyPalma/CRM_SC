import { cookies } from 'next/headers';

export async function getTenantHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  let tenantId = 'default-tenant';

  if (token) {
    try {
      // Decode the JWT without verifying signature just to extract the tenantId
      // The backend services will verify the signature if JwtAuthGuard is applied.
      const payloadBase64 = token.split('.')[1];
      if (payloadBase64) {
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        if (payload.tenantId) {
          tenantId = payload.tenantId;
        }
      }
    } catch (e) {
      console.error('Error decoding token', e);
    }
  }

  return {
    'x-tenant-id': tenantId,
    'Authorization': token ? `Bearer ${token}` : ''
  };
}
