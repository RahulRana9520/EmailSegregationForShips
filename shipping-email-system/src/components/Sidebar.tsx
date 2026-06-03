"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/' },
    { name: 'Manual Ingest', path: '/ingest' },
    { name: 'Email Inbox', path: '/inbox' },
    { name: 'Extracted Data', path: '/data' },
    { name: 'Search & Filters', path: '/search' },
    { name: 'Matches', path: '/matches' },
    { name: 'Reports', path: '/reports' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-color-neo-purple neo-border border-r-[3px] p-6 flex flex-col gap-8">
      <div className="font-black text-2xl tracking-tighter uppercase p-2 bg-color-neo-yellow neo-border neo-shadow">
        Shipping<br/>Segregation
      </div>
      
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="font-bold text-lg hover:underline decoration-4 underline-offset-4 decoration-black p-2 hover:bg-white neo-border border-transparent hover:border-black hover:neo-shadow-hover transition-all"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <div className="bg-white neo-border p-2">
          <p className="font-bold text-xs text-gray-500 uppercase">Logged in as:</p>
          <p className="font-black truncate" title={user || ''}>{user}</p>
        </div>
        <button
          onClick={logout}
          className="w-full block text-center font-bold bg-color-neo-pink neo-border neo-shadow py-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};
