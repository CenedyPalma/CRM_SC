'use server'
import { getTenantHeaders } from '@/lib/auth';

import { revalidatePath } from 'next/cache';

const AUTOMATION_URL = 'http://localhost:3009';

export async function createWorkflow(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description');
  const triggerType = formData.get('triggerType');

  await fetch(`${AUTOMATION_URL}/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ 
      name, 
      description,
      triggerType,
      triggerData: {}
    })
  });

  revalidatePath('/automations');
}
