"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useShipping } from '@/context/ShippingContext';

export default function InboxPage() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const { emails } = useShipping();

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Email Inbox</h1>
        <p className="text-xl font-bold text-gray-700">View incoming shipping emails and their extraction status.</p>
      </div>

      <div className="flex gap-6 flex-1">
        {/* Email List */}
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto">
          {emails.length === 0 && <p className="font-bold text-gray-500">No emails ingested yet. Add one from the "Add Real Email" tab!</p>}
          {emails.map((email) => (
            <div 
              key={email.id} 
              className={`neo-border neo-shadow cursor-pointer p-4 transition-all hover:bg-white ${selectedEmail === email.id ? 'bg-color-neo-yellow translate-x-[2px] translate-y-[2px] shadow-none' : 'bg-gray-100'}`}
              onClick={() => setSelectedEmail(email.id)}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm truncate">{email.sender}</span>
                <span className="text-xs font-bold">{email.date}</span>
              </div>
              <h3 className="font-black text-lg leading-tight mb-2">{email.subject}</h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs font-bold border-2 border-black ${email.extracted ? 'bg-color-neo-green' : 'bg-color-neo-pink'}`}>
                  {email.extracted ? 'Extracted' : 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Email View */}
        <div className="w-2/3">
          {selectedEmail !== null ? (
            <Card title="Email Contents" className="h-full flex flex-col">
              <div className="mb-6 pb-4 border-b-4 border-black border-dashed">
                <p className="font-bold text-lg">From: {emails.find(e => e.id === selectedEmail)?.sender}</p>
                <p className="font-black text-2xl mt-2">{emails.find(e => e.id === selectedEmail)?.subject}</p>
              </div>
              <div className="flex-1 font-mono text-lg whitespace-pre-wrap">
                {emails.find(e => e.id === selectedEmail)?.body}
              </div>
              <div className="mt-8 flex gap-4 border-t-4 border-black pt-4">
                <Button variant="success">Re-run Extraction</Button>
                <Button variant="danger">Delete Email</Button>
              </div>
            </Card>
          ) : (
            <Card title="No Email Selected" className="h-full flex items-center justify-center bg-gray-100">
              <p className="text-xl font-bold text-gray-500">Select an email from the list to view its contents.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
