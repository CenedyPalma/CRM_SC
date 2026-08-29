'use client';

import { useState } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';

export function WhatsAppButton({ contactId, phone }: { contactId: string; phone?: string }) {
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSend = async () => {
    if (!phone) {
      alert("This contact does not have a phone number.");
      return;
    }
    
    setIsSending(true);
    setStatus('idle');
    
    try {
      const res = await fetch('/api/automation/actions/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phone,
          message: 'Hello from Business OS!',
          contactId,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to send message');
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button 
      onClick={handleSend}
      disabled={isSending}
      className={`w-full py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 
        ${status === 'success' ? 'bg-green-600 hover:bg-green-500 text-white' : 
          status === 'error' ? 'bg-red-600 hover:bg-red-500 text-white' : 
          'bg-indigo-600 hover:bg-indigo-500 text-white'}
      `}
    >
      {isSending ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <MessageCircle size={16} />
      )}
      <span>
        {status === 'success' ? 'Message Sent!' : 
         status === 'error' ? 'Error Sending' : 
         isSending ? 'Sending...' : 'Auto-Follow Up (WhatsApp)'}
      </span>
    </button>
  );
}
