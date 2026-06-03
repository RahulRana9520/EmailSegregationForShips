"use client";

import React, { useState, useMemo } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useShipping } from '@/context/ShippingContext';
import { TonnageData, CargoVCData, CargoTCData } from '@/utils/parser';

export default function MatchesPage() {
  const { records } = useShipping();
  const [matchStatuses, setMatchStatuses] = useState<Record<string, 'Pending' | 'Approved' | 'Rejected'>>({});

  const matches = useMemo(() => {
    const tonnage = records.filter(r => r.category === 'Tonnage') as TonnageData[];
    const cargoVC = records.filter(r => r.category === 'Cargo VC') as CargoVCData[];
    const cargoTC = records.filter(r => r.category === 'Cargo TC') as CargoTCData[];
    
    const allCargo = [...cargoVC, ...cargoTC];
    const generatedMatches: any[] = [];

    tonnage.forEach(t => {
      allCargo.forEach(c => {
        let score = 50; // Base score
        let reasons = [];

        const loadPort = c.category === 'Cargo VC' ? c.loadingPort : (c as CargoTCData).deliveryPort;
        const laycan = c.laycan.toUpperCase();
        
        // Very basic string overlap logic
        if (loadPort.toUpperCase() !== 'UNKNOWN' && t.openPort.toUpperCase().includes(loadPort.toUpperCase().substring(0, 3))) {
          score += 35;
          reasons.push('Port Match');
        }

        if (laycan !== 'UNKNOWN' && laycan.includes(t.openDate.substring(0, 3))) {
          score += 15;
          reasons.push('Date Overlap');
        }

        // Cap at 98% because we are never perfectly sure without human review
        if (score > 98) score = 98;

        generatedMatches.push({
          id: `${t.id}-${c.id}`,
          confidence: score,
          reasons: reasons.length > 0 ? reasons.join(', ') : 'Possible Fit',
          vessel: t,
          cargo: c
        });
      });
    });

    // Sort by highest confidence first
    return generatedMatches.sort((a, b) => b.confidence - a.confidence);
  }, [records]);

  const handleStatusUpdate = (matchId: string, status: 'Approved' | 'Rejected') => {
    setMatchStatuses(prev => ({ ...prev, [matchId]: status }));
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col gap-6 h-full">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Vessel-Cargo Matches</h1>
          <p className="text-xl font-bold text-gray-700">Review automated matches between open Tonnage and Cargo requirements.</p>
        </div>
        <div className="p-12 text-center bg-white neo-border neo-shadow">
          <h2 className="text-2xl font-black mb-4">No Data to Match</h2>
          <p className="font-bold text-gray-600">Please ingest both Tonnage and Cargo emails in the "Add Real Email" tab to see matches here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Vessel-Cargo Matches</h1>
        <p className="text-xl font-bold text-gray-700">Review automated matches between open Tonnage and Cargo requirements.</p>
      </div>

      <div className="flex flex-col gap-8 flex-1">
        {matches.map((match) => {
          const status = matchStatuses[match.id] || 'Pending';
          if (status === 'Rejected') return null; // Hide rejected matches visually to clean up the queue
          
          return (
            <div key={match.id} className="flex flex-col lg:flex-row gap-0 neo-border neo-shadow bg-white relative">
              
              {/* Confidence Badge */}
              <div className={`absolute -top-4 -left-4 px-3 py-1 font-black text-lg border-[3px] border-black ${match.confidence > 80 ? 'bg-color-neo-green' : 'bg-color-neo-yellow'}`}>
                Match: {match.confidence}%
              </div>
              
              {/* Status Badge */}
              {status === 'Approved' && (
                <div className="absolute -top-4 -right-4 px-3 py-1 font-black text-lg border-[3px] border-black bg-color-neo-pink">
                  APPROVED
                </div>
              )}

              {/* Cargo Side */}
              <div className="flex-1 p-6 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black pt-8 bg-gray-50">
                <h3 className="font-black text-xl mb-4 bg-white inline-block px-2 border-2 border-black uppercase">{match.cargo.category} Requirement</h3>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-lg">Cargo: <span className="font-black text-blue-800">{match.cargo.cargoName}</span></p>
                  <p className="font-bold">Account: {match.cargo.accountName}</p>
                  <p className="font-bold">
                    Route: <span className="underline decoration-wavy">{match.cargo.category === 'Cargo VC' ? match.cargo.loadingPort : (match.cargo as CargoTCData).deliveryPort}</span> 
                    {' -> '} {match.cargo.category === 'Cargo VC' ? match.cargo.dischargePort : (match.cargo as CargoTCData).redeliveryPort}
                  </p>
                  <p className="font-bold font-mono bg-yellow-200 inline-block px-1">Laycan/Dates: {match.cargo.laycan}</p>
                </div>
              </div>

              {/* Vessel Side */}
              <div className="flex-1 p-6 pt-8 bg-white">
                <h3 className="font-black text-xl mb-4 bg-gray-200 inline-block px-2 border-2 border-black uppercase">Available Tonnage</h3>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-lg">Vessel: <span className="font-black text-green-800">{match.vessel.vesselName}</span></p>
                  <p className="font-bold">Account: {match.vessel.accountName}</p>
                  <p className="font-bold font-mono bg-yellow-200 inline-block px-1">Open: {match.vessel.openPort} (O/A {match.vessel.openDate})</p>
                  <p className="font-bold">Capacity: {match.vessel.vesselSize} DWT</p>
                </div>
                <div className="mt-4 p-2 border-2 border-dashed border-black text-sm font-bold text-gray-600">
                  Algorithm Note: {match.reasons}
                </div>
              </div>

              {/* Actions */}
              <div className="flex lg:flex-col justify-center items-center gap-4 p-6 bg-gray-100 border-t-[3px] lg:border-t-0 lg:border-l-[3px] border-black">
                {status !== 'Approved' && (
                  <>
                    <Button variant="success" className="w-full" onClick={() => handleStatusUpdate(match.id, 'Approved')}>Approve</Button>
                    <Button variant="danger" className="w-full" onClick={() => handleStatusUpdate(match.id, 'Rejected')}>Reject</Button>
                  </>
                )}
                {status === 'Approved' && (
                  <Button variant="secondary" className="w-full" onClick={() => handleStatusUpdate(match.id, 'Pending')}>Undo</Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
