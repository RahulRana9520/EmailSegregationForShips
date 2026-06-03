"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useShipping } from "@/context/ShippingContext";

export default function Home() {
  const { emails, records } = useShipping();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-2">Dashboard</h1>
        <p className="text-xl font-bold text-gray-700">Overview of your shipping segregation system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Emails" color="yellow">
          <p className="text-5xl font-black">{emails.length}</p>
          <p className="font-bold text-gray-600 mt-2">Processed today</p>
        </Card>
        
        <Card title="Tonnage (Vessels)" color="cyan">
          <p className="text-5xl font-black">{records.filter(r => r.category === 'Tonnage').length}</p>
          <p className="font-bold text-gray-600 mt-2">Open vessels</p>
        </Card>

        <Card title="Cargo VC" color="pink">
          <p className="text-5xl font-black">{records.filter(r => r.category === 'Cargo VC').length}</p>
          <p className="font-bold text-gray-600 mt-2">Voyage Charter</p>
        </Card>

        <Card title="Cargo TC" color="green">
          <p className="text-5xl font-black">{records.filter(r => r.category === 'Cargo TC').length}</p>
          <p className="font-bold text-gray-600 mt-2">Time Charter</p>
        </Card>
      </div>

      <Card title="Quick Actions" color="white" className="mt-4">
        <div className="flex gap-4">
          <Button variant="primary">Process Pending</Button>
          <Button variant="secondary">View Recent Errors</Button>
          <Button variant="success">Sync Database</Button>
        </div>
      </Card>
    </div>
  );
}
