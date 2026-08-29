'use server'
import { getTenantHeaders } from '@/lib/auth';

import { revalidatePath } from 'next/cache';

const PLATFORM_URL = 'http://localhost:3008';

export async function createCustomObject(formData: FormData) {
  const name = formData.get('name') as string;
  const apiName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const description = formData.get('description');

  await fetch(`${PLATFORM_URL}/custom-objects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ name, apiName, description })
  });

  revalidatePath('/platform/objects');
}

export async function createCustomField(formData: FormData) {
  const customObjectId = formData.get('customObjectId');
  const name = formData.get('name') as string;
  const apiName = name.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const fieldType = formData.get('fieldType');
  const isRequired = formData.get('isRequired') === 'true';

  await fetch(`${PLATFORM_URL}/custom-objects/${customObjectId}/fields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ name, apiName, fieldType, isRequired })
  });

  revalidatePath(`/platform/objects/${customObjectId}`);
}
