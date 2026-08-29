'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await fetch(`/api/auth${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error('Authentication failed');
      }
      
      const responseData = await res.json();
      
      // Store token (in a real app, use HttpOnly cookies or next-auth)
      // Now handled automatically via HttpOnly cookie set by API Gateway proxy
      
      // Force reload to apply auth state
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 to-zinc-950"></div>
      
      <div className="relative w-full max-w-md z-10 p-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-indigo-500/20">
            OS
          </div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Business OS</h1>
          <p className="text-zinc-400 mt-2 text-sm">Sign in to your centralized enterprise workspace.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-900/50 rounded-lg flex items-center space-x-2 text-red-400 text-sm">
                <Shield size={16} />
                <span>{error}</span>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <input required name="name" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow" placeholder="Jane Doe" />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <input required name="email" type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow" placeholder="admin@example.com" />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                {isLogin && <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300">Forgot password?</a>}
              </div>
              <input required name="password" type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow" placeholder="••••••••" />
            </div>

            <button type="submit" className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white rounded-md transition-all shadow-sm flex items-center justify-center space-x-2 group">
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
          
          <div className="p-4 bg-zinc-950/50 border-t border-zinc-800 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
