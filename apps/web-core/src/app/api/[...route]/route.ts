import { NextRequest, NextResponse } from 'next/server';

// Map of prefixes to internal microservice URLs
const serviceMap: Record<string, string> = {
  'crm': 'http://localhost:3001',
  'sales': 'http://localhost:3005',
  'platform': 'http://localhost:3008',
  'ai': 'http://localhost:3010',
  'automation': 'http://localhost:3009',
  'marketplace': 'http://localhost:3012',
  'auth': 'http://localhost:3011',
  'bi': 'http://localhost:3013',
  'chat': 'http://localhost:3014',
  'finance': 'http://localhost:3015',
  'helpdesk': 'http://localhost:3016',
  'projects': 'http://localhost:3017',
  'hr': 'http://localhost:3018',
  'search': 'http://localhost:3019',
  'documents': 'http://localhost:3020',
  'admin': 'http://localhost:3021',
  'developer': 'http://localhost:3022',
  'audit': 'http://localhost:3023',
  'cms': 'http://localhost:3024',
  'settings': 'http://localhost:3025',
  'inventory': 'http://localhost:3026',
};

export async function processRequest(req: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const resolvedParams = await params;
  const servicePrefix = resolvedParams.route[0];
  const targetBase = serviceMap[servicePrefix];
  
  if (!targetBase) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const remainingPath = resolvedParams.route.slice(1).join('/');
  // The auth service mounts login/register under @Controller('auth'), so that prefix must
  // survive the strip. Its users/roles controllers are mounted at the root and must not.
  const backendPath =
    servicePrefix === 'auth' && ['login', 'register'].includes(remainingPath)
      ? `auth/${remainingPath}`
      : remainingPath;
  const targetUrl = `${targetBase}/${backendPath}${req.nextUrl.search}`;

  // The middleware has already verified the JWT and injected the x-tenant-id into the req.headers
  const tenantId = req.headers.get('x-tenant-id');
  
  const isPublicCms = servicePrefix === 'cms' && remainingPath.startsWith('pages/public');
  
  if (!tenantId && servicePrefix !== 'auth' && !isPublicCms) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const newHeaders = new Headers();
  // Copy content type
  if (req.headers.get('content-type')) {
    newHeaders.set('content-type', req.headers.get('content-type')!);
  }
  // Inject secured headers
  if (tenantId) {
    newHeaders.set('x-tenant-id', tenantId);
  }
  const authHeader = req.headers.get('authorization');
  const token = req.cookies.get('access_token')?.value;
  if (authHeader) {
    newHeaders.set('authorization', authHeader);
  } else if (token) {
    newHeaders.set('authorization', `Bearer ${token}`);
  }

  try {
    const fetchOptions: RequestInit = {
      method: req.method,
      headers: newHeaders,
    };
    
    // Only pass body for non-GET/HEAD
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const body = await req.text();
      if (body) {
        fetchOptions.body = body;
      }
    }

    const res = await fetch(targetUrl, fetchOptions);
    
    // Pass back the response
    const resBody = await res.text();
    const resHeaders = new Headers(res.headers);
    // Don't forward transfer-encoding
    resHeaders.delete('transfer-encoding');
    
    // Intercept login/register to set HttpOnly cookie
    if (backendPath === 'auth/login' || backendPath === 'auth/register') {
      if (res.status === 200 || res.status === 201) {
        try {
          const data = JSON.parse(resBody);
          if (data.access_token) {
            resHeaders.set('Set-Cookie', `access_token=${data.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`);
          }
        } catch (e) {
          console.error('Failed to parse auth response', e);
        }
      }
    }
    
    return new NextResponse(resBody, {
      status: res.status,
      headers: resHeaders,
    });
  } catch (error) {
    console.error('API Gateway proxy error:', error);
    return NextResponse.json({ error: 'Internal Gateway Error' }, { status: 500 });
  }
}

export const GET = processRequest;
export const POST = processRequest;
export const PUT = processRequest;
export const DELETE = processRequest;
export const PATCH = processRequest;
