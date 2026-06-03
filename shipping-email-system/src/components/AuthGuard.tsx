"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useShipping } from '@/context/ShippingContext';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Sidebar } from '@/components/Sidebar';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, login } = useAuth();
  const { autoSyncInbox, isSynced } = useShipping();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simulated authentication
    login(email);
  };

  // Run the sync when user logs in and it hasn't synced yet
  useEffect(() => {
    if (user && !isSynced && !isSyncing) {
      setIsSyncing(true);
      autoSyncInbox().finally(() => {
        setIsSyncing(false);
      });
    }
  }, [user, isSynced, isSyncing, autoSyncInbox]);

  if (!user) {
    return (
      <div className="min-h-screen bg-color-neo-yellow flex items-center justify-center p-4">
        <Card className="w-full max-w-md" color="white">
          <div className="text-center mb-8">
            <h1 className="font-black text-4xl uppercase tracking-tighter mb-2">Broker Login</h1>
            <p className="font-bold text-gray-600">Shipping Segregation AI</p>
          </div>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <Input 
              label="Broker Email Address" 
              type="email" 
              placeholder="broker@shipping.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && <p className="font-bold text-color-neo-pink bg-white px-2 py-1 border-2 border-black inline-block">{error}</p>}
            
            <Button type="submit" variant="primary" className="w-full mt-4">Log In & Sync Inbox</Button>
            
            <p className="text-center font-bold text-sm text-gray-500 mt-4">
              *Prototype: Any email/password combination will work.
            </p>
          </form>
        </Card>
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-color-neo-cyan flex flex-col items-center justify-center p-4 gap-8">
        <div className="text-6xl animate-spin">⚙️</div>
        <Card color="white" className="max-w-md text-center p-8">
          <h2 className="font-black text-3xl mb-4">Syncing Broker Inbox...</h2>
          <p className="font-bold text-xl text-gray-700">Fetching unread emails from IMAP server and passing them through the AI Extraction Engine.</p>
          <div className="w-full bg-gray-200 h-4 border-2 border-black mt-6 overflow-hidden">
            <div className="bg-color-neo-pink h-full w-full animate-pulse origin-left scale-x-50"></div>
          </div>
        </Card>
      </div>
    );
  }

  // If authenticated and synced, render the layout structure
  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {children}
      </main>
    </div>
  );
};
