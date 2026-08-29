'use server'
import { getTenantHeaders } from '@/lib/auth';

import { revalidatePath } from 'next/cache';

export async function createContact(formData: FormData) {
  const firstName = formData.get('firstName');
  const lastName = formData.get('lastName');
  const email = formData.get('email');
  const phone = formData.get('phone');
  const companyId = formData.get('companyId');

  await fetch('http://localhost:3001/contacts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ firstName, lastName, email, phone, companyId })
  });

  revalidatePath('/');
}

export async function createDeal(formData: FormData) {
  const title = formData.get('title');
  const amount = Number(formData.get('amount'));
  const stage = formData.get('stage');

  await fetch('http://localhost:3005/deals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ title, amount, stage })
  });

  revalidatePath('/deals');
}
