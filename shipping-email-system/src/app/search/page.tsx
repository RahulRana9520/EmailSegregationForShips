"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useShipping } from '@/context/ShippingContext';

export default function SearchPage() {
  const { emails, records } = useShipping();
  const [query, setQuery] = useState('');
  
  // Filter states
  const [showEmails, setShowEmails] = useState(true);
  const [showTonnage, setShowTonnage] = useState(true);
  const [showCargoVC, setShowCargoVC] = useState(true);
  const [showCargoTC, setShowCargoTC] = useState(true);

  // Expanded state
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Combine real results
  const allResults = [
    ...(showEmails ? emails.map(e => ({ type: 'Email', id: e.id, desc: e.subject, raw: e })) : []),
    ...(records
      .filter(d => {
        if (d.category === 'Tonnage' && !showTonnage) return false;
        if (d.category === 'Cargo VC' && !showCargoVC) return false;
        if (d.category === 'Cargo TC' && !showCargoTC) return false;
        return true;
      })
      .map(d => ({ 
        type: d.category, 
        id: d.id, 
        desc: d.category === 'Tonnage' ? (d as any).vesselName : (d as any).cargoName,
        raw: d 
      })))
  ];

  const filteredResults = query 
    ? allResults.filter(r => r.id.includes(query) || (r.desc && r.desc.toLowerCase().includes(query.toLowerCase())))
    : allResults;

  return (
    <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Search & Filters</h1>
        <p className="text-xl font-bold text-gray-700">Search through all your emails, extracted vessels, and cargo.</p>
      </div>

      <Card color="cyan" className="flex flex-col gap-4">
        <div className="flex gap-4 items-end">
          <Input 
            label="Search Query" 
            placeholder="Enter vessel name, cargo, or keywords..." 
            className="flex-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4 mt-2 flex-wrap">
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" className="w-5 h-5 neo-border" checked={showEmails} onChange={(e) => setShowEmails(e.target.checked)} /> Emails
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" className="w-5 h-5 neo-border" checked={showTonnage} onChange={(e) => setShowTonnage(e.target.checked)} /> Tonnage
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" className="w-5 h-5 neo-border" checked={showCargoVC} onChange={(e) => setShowCargoVC(e.target.checked)} /> Cargo VC
          </label>
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" className="w-5 h-5 neo-border" checked={showCargoTC} onChange={(e) => setShowCargoTC(e.target.checked)} /> Cargo TC
          </label>
        </div>
      </Card>

      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-2xl font-black uppercase border-b-4 border-black pb-2">Results ({filteredResults.length})</h2>
        
        {filteredResults.length === 0 && !query && (
          <div className="p-8 text-center font-bold text-gray-500 bg-white neo-border neo-shadow">
            No data available. Please add some emails in the "Add Real Email" tab first!
          </div>
        )}

        {filteredResults.map((result, i) => (
          <div key={i} className="bg-white neo-border neo-shadow p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <span className="px-2 py-1 text-xs font-bold border-2 border-black bg-color-neo-yellow inline-block">
                {result.type}
              </span>
              <span className="font-bold font-mono text-gray-500 text-sm">ID: {result.id}</span>
            </div>
            <p className="font-black text-xl mt-2">{result.desc || 'Unknown Name'}</p>
            <div className="mt-2">
              <Button size="sm" variant="secondary" onClick={() => setExpandedId(expandedId === result.id ? null : result.id)}>
                {expandedId === result.id ? 'Hide Details' : 'View Details'}
              </Button>
            </div>
            {expandedId === result.id && (
              <div className="mt-4 p-4 bg-gray-100 border-2 border-black text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                {result.type === 'Email' ? (
                  <>
                    <p className="font-bold border-b border-black pb-1 mb-2">Full Email Body:</p>
                    {(result.raw as any).body}
                  </>
                ) : (
                  <>
                    <p className="font-bold border-b border-black pb-1 mb-2">Extracted Fields:</p>
                    {Object.entries(result.raw)
                      .filter(([key]) => key !== 'id' && key !== 'emailId')
                      .map(([key, val]) => (
                      <div key={key} className="mb-1">
                        <span className="font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {val as string}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        
        {filteredResults.length === 0 && query && (
          <div className="p-8 text-center font-bold text-gray-500 bg-white neo-border neo-shadow">
            No results found for "{query}".
          </div>
        )}
      </div>
    </div>
  );
}
