"use client";

import React, { useMemo } from 'react';
import { Card } from '@/components/Card';
import { useShipping } from '@/context/ShippingContext';

export default function ReportsPage() {
  const { emails, records } = useShipping();

  const metrics = useMemo(() => {
    const tonnageCount = records.filter(r => r.category === 'Tonnage').length;
    const vcCount = records.filter(r => r.category === 'Cargo VC').length;
    const tcCount = records.filter(r => r.category === 'Cargo TC').length;
    
    // Calculate Top Accounts
    const accountCounts: Record<string, number> = {};
    records.forEach(r => {
      const name = r.accountName || 'Unknown';
      accountCounts[name] = (accountCounts[name] || 0) + 1;
    });

    const topAccounts = Object.entries(accountCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const extractionRate = emails.length > 0 
      ? Math.round((emails.filter(e => e.extracted).length / emails.length) * 100) 
      : 0;

    return { tonnageCount, vcCount, tcCount, topAccounts, extractionRate };
  }, [emails, records]);

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Analytics & Reports</h1>
        <p className="text-xl font-bold text-gray-700">Performance metrics of your shipping segregation AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Extraction Success Rate" color="purple" className="h-64 flex flex-col items-center justify-center">
          <div className="text-7xl font-black">{metrics.extractionRate}%</div>
          <p className="font-bold mt-4">Emails with parsable data</p>
        </Card>

        <Card title="Data Distribution" color="white" className="h-64 flex items-center justify-center bg-stripes">
          <div className="w-full h-full border-4 border-black bg-gray-100 flex items-end justify-around p-4 pb-0">
            {records.length === 0 && <div className="font-bold self-center">No Data Yet</div>}
            
            {records.length > 0 && (
              <>
                <div 
                  className="w-16 bg-color-neo-cyan border-4 border-b-0 border-black flex items-end justify-center pb-2 font-bold transition-all duration-500" 
                  style={{ height: `${Math.max(10, (metrics.tonnageCount / records.length) * 100)}%` }}
                  title={`Tonnage: ${metrics.tonnageCount}`}
                >T</div>
                <div 
                  className="w-16 bg-color-neo-pink border-4 border-b-0 border-black flex items-end justify-center pb-2 font-bold transition-all duration-500" 
                  style={{ height: `${Math.max(10, (metrics.vcCount / records.length) * 100)}%` }}
                  title={`Cargo VC: ${metrics.vcCount}`}
                >VC</div>
                <div 
                  className="w-16 bg-color-neo-yellow border-4 border-b-0 border-black flex items-end justify-center pb-2 font-bold transition-all duration-500" 
                  style={{ height: `${Math.max(10, (metrics.tcCount / records.length) * 100)}%` }}
                  title={`Cargo TC: ${metrics.tcCount}`}
                >TC</div>
              </>
            )}
          </div>
        </Card>

        <Card title="Top Accounts (By Volume)" color="cyan" className="h-64">
          {metrics.topAccounts.length === 0 ? (
            <p className="font-bold text-gray-500 mt-4">No accounts extracted yet.</p>
          ) : (
            <ul className="flex flex-col gap-2 font-bold text-lg">
              {metrics.topAccounts.map(([name, count], index) => (
                <li key={name} className="flex justify-between border-b-2 border-black pb-2">
                  <span className="truncate pr-4">{index + 1}. {name}</span> 
                  <span>{count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Overall Volume" color="yellow" className="h-64 flex flex-col justify-center">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="font-black text-xl">Total Emails</span>
              <span className="font-black text-3xl">{emails.length}</span>
            </div>
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="font-black text-xl">Total Extracted Records</span>
              <span className="font-black text-3xl">{records.length}</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
