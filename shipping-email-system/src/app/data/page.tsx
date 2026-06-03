"use client";

import React, { useState } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useShipping } from '@/context/ShippingContext';
import { TonnageData, CargoVCData, CargoTCData } from '@/utils/parser';

export default function ExtractedDataPage() {
  const { records } = useShipping();
  const [activeTab, setActiveTab] = useState<'Tonnage' | 'Cargo VC' | 'Cargo TC'>('Tonnage');

  const tonnageRecords = records.filter(r => r.category === 'Tonnage') as TonnageData[];
  const cargoVCRecords = records.filter(r => r.category === 'Cargo VC') as CargoVCData[];
  const cargoTCRecords = records.filter(r => r.category === 'Cargo TC') as CargoTCData[];

  const handleExportCSV = () => {
    let dataToExport: any[] = [];
    let headers: string[] = [];

    if (activeTab === 'Tonnage') {
      dataToExport = tonnageRecords;
      headers = ['vesselName', 'accountName', 'openPort', 'openDate', 'vesselSize'];
    } else if (activeTab === 'Cargo VC') {
      dataToExport = cargoVCRecords;
      headers = ['cargoName', 'accountName', 'loadingPort', 'dischargePort', 'laycan'];
    } else if (activeTab === 'Cargo TC') {
      dataToExport = cargoTCRecords;
      headers = ['cargoName', 'accountName', 'deliveryPort', 'redeliveryPort', 'duration', 'laycan'];
    }

    if (dataToExport.length === 0) {
      alert(`No data to export for ${activeTab}.`);
      return;
    }

    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => headers.map(header => `"${(row as any)[header] || ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab.replace(' ', '_')}_Export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Extracted Maritime Data</h1>
          <p className="text-xl font-bold text-gray-700">Structured data automatically parsed from incoming shipping emails.</p>
        </div>
        <Button variant="primary" onClick={handleExportCSV}>Export {activeTab} to CSV</Button>
      </div>

      <div className="flex gap-4 border-b-4 border-black">
        <button 
          className={`px-6 py-3 font-black uppercase text-xl transition-all ${activeTab === 'Tonnage' ? 'bg-color-neo-cyan border-t-4 border-x-4 border-black' : 'bg-gray-200 opacity-70 hover:opacity-100'}`}
          onClick={() => setActiveTab('Tonnage')}
        >
          Tonnage ({tonnageRecords.length})
        </button>
        <button 
          className={`px-6 py-3 font-black uppercase text-xl transition-all ${activeTab === 'Cargo VC' ? 'bg-color-neo-pink border-t-4 border-x-4 border-black' : 'bg-gray-200 opacity-70 hover:opacity-100'}`}
          onClick={() => setActiveTab('Cargo VC')}
        >
          Cargo VC ({cargoVCRecords.length})
        </button>
        <button 
          className={`px-6 py-3 font-black uppercase text-xl transition-all ${activeTab === 'Cargo TC' ? 'bg-color-neo-yellow border-t-4 border-x-4 border-black' : 'bg-gray-200 opacity-70 hover:opacity-100'}`}
          onClick={() => setActiveTab('Cargo TC')}
        >
          Cargo TC ({cargoTCRecords.length})
        </button>
      </div>

      <Card className="flex-1 rounded-none border-t-0" color="white">
        <div className="overflow-x-auto">
          
          {activeTab === 'Tonnage' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-gray-100">
                  <th className="p-4 font-black uppercase">Vessel Name</th>
                  <th className="p-4 font-black uppercase">Account Name</th>
                  <th className="p-4 font-black uppercase">Open Port</th>
                  <th className="p-4 font-black uppercase">Open Date</th>
                  <th className="p-4 font-black uppercase">Size/DWT</th>
                  <th className="p-4 font-black uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {tonnageRecords.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center font-bold">No Tonnage data extracted yet.</td></tr>
                )}
                {tonnageRecords.map((row) => (
                  <tr key={row.id} className="border-b-2 border-black hover:bg-color-neo-cyan transition-colors">
                    <td className="p-4 font-black text-lg">{row.vesselName}</td>
                    <td className="p-4 font-bold text-gray-700">{row.accountName}</td>
                    <td className="p-4 font-bold">{row.openPort}</td>
                    <td className="p-4 font-bold">{row.openDate}</td>
                    <td className="p-4 font-bold font-mono">{row.vesselSize}</td>
                    <td className="p-4 text-center"><Button size="sm" variant="secondary">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'Cargo VC' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-gray-100">
                  <th className="p-4 font-black uppercase">Cargo Name</th>
                  <th className="p-4 font-black uppercase">Account Name</th>
                  <th className="p-4 font-black uppercase">Load Port</th>
                  <th className="p-4 font-black uppercase">Discharge Port</th>
                  <th className="p-4 font-black uppercase">Laycan</th>
                  <th className="p-4 font-black uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cargoVCRecords.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center font-bold">No Cargo VC data extracted yet.</td></tr>
                )}
                {cargoVCRecords.map((row) => (
                  <tr key={row.id} className="border-b-2 border-black hover:bg-color-neo-pink transition-colors">
                    <td className="p-4 font-black text-lg">{row.cargoName}</td>
                    <td className="p-4 font-bold text-gray-700">{row.accountName}</td>
                    <td className="p-4 font-bold">{row.loadingPort}</td>
                    <td className="p-4 font-bold">{row.dischargePort}</td>
                    <td className="p-4 font-bold font-mono">{row.laycan}</td>
                    <td className="p-4 text-center"><Button size="sm" variant="secondary">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'Cargo TC' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-gray-100">
                  <th className="p-4 font-black uppercase">Cargo Name</th>
                  <th className="p-4 font-black uppercase">Account Name</th>
                  <th className="p-4 font-black uppercase">Delivery Port</th>
                  <th className="p-4 font-black uppercase">Redelivery Port</th>
                  <th className="p-4 font-black uppercase">Duration / LC</th>
                  <th className="p-4 font-black uppercase text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {cargoTCRecords.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center font-bold">No Cargo TC data extracted yet.</td></tr>
                )}
                {cargoTCRecords.map((row) => (
                  <tr key={row.id} className="border-b-2 border-black hover:bg-color-neo-yellow transition-colors">
                    <td className="p-4 font-black text-lg">{row.cargoName}</td>
                    <td className="p-4 font-bold text-gray-700">{row.accountName}</td>
                    <td className="p-4 font-bold">{row.deliveryPort}</td>
                    <td className="p-4 font-bold">{row.redeliveryPort}</td>
                    <td className="p-4 font-bold font-mono">{row.duration} <br/><span className="text-xs text-gray-500">{row.laycan}</span></td>
                    <td className="p-4 text-center"><Button size="sm" variant="secondary">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

        </div>
      </Card>
    </div>
  );
}
