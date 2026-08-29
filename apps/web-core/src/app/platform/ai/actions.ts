'use server'
import { getTenantHeaders } from '@/lib/auth';

import { revalidatePath } from 'next/cache';

const AI_ENGINE_URL = 'http://localhost:3010';

export async function createPromptTemplate(formData: FormData) {
  const name = formData.get('name') as string;
  const prompt = formData.get('prompt') as string;
  const model = formData.get('model') as string;

  await fetch(`${AI_ENGINE_URL}/prompts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ name, prompt, model })
  });

  revalidatePath('/platform/ai');
}

export async function createKnowledgeDocument(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;

  await fetch(`${AI_ENGINE_URL}/knowledge`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getTenantHeaders())
    },
    body: JSON.stringify({ title, content })
  });

  revalidatePath('/platform/ai');
}
