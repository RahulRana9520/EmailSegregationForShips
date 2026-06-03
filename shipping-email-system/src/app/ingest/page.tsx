"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useShipping } from '@/context/ShippingContext';
import { parseMaritimeEmail, categorizeEmail } from '@/utils/parser';

export default function IngestPage() {
  const { addEmail } = useShipping();
  const [emailText, setEmailText] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const handleParse = () => {
    if (!emailText.trim()) return;

    setStatus('Parsing email...');
    
    const emailId = Date.now().toString();
    const category = categorizeEmail(emailText);
    const newRecords = parseMaritimeEmail(emailText, emailId);

    // Add email to context
    addEmail({
      id: emailId,
      sender: 'broker@shipping.com',
      subject: `New ${category} Email`,
      date: new Date().toLocaleDateString(),
      body: emailText,
      category,
      extracted: newRecords.length > 0
    }, newRecords);

    if (newRecords.length > 0) {
      setStatus(`Success! Extracted ${newRecords.length} records (${category}).`);
    } else {
      setStatus(`Categorized as ${category}, but no data could be extracted.`);
    }
    
    setEmailText('');
  };

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Add Maritime Email</h1>
        <p className="text-xl font-bold text-gray-700">Paste raw text from a Tonnage or Cargo email to automatically categorize and extract it.</p>
      </div>

      <Card color="yellow" className="flex flex-col gap-4">
        <label className="font-bold text-lg">Email Body Text</label>
        <textarea 
          className="neo-border neo-shadow w-full h-64 p-4 resize-none font-mono focus:outline-none text-sm"
          placeholder="Paste Tonnage or Cargo (VC/TC) email text here..."
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
        />
        <div className="flex items-center gap-4">
          <Button variant="primary" onClick={handleParse}>Categorize & Extract</Button>
          {status && <span className="font-bold border-b-2 border-black px-2 py-1 bg-white">{status}</span>}
        </div>
      </Card>
      
      <Card color="white">
        <h3 className="font-black text-xl mb-2">How the Parser Works</h3>
        <p className="font-bold text-gray-700">
          The local Rule-Based Engine scans the email for keywords like "DWT", "FIOS", "TCT", and port names to classify it as Tonnage, Cargo VC, or Cargo TC. It then uses Regex to pull out vessel names, capacities, loading/discharge ports, and laycans!
        </p>
      </Card>
    </div>
  );
}
