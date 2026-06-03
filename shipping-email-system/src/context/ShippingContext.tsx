"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ExtractedRecord, EmailCategory, categorizeEmail, parseMaritimeEmail } from '@/utils/parser';

export interface EmailData {
  id: string;
  sender: string;
  subject: string;
  date: string;
  body: string;
  category: EmailCategory;
  extracted: boolean;
}

interface ShippingContextType {
  emails: EmailData[];
  records: ExtractedRecord[];
  addEmail: (email: EmailData, newRecords: ExtractedRecord[]) => void;
  autoSyncInbox: () => Promise<void>;
  isSynced: boolean;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<EmailData[]>([]);
  const [records, setRecords] = useState<ExtractedRecord[]>([]);
  const [isSynced, setIsSynced] = useState(false);

  const addEmail = (email: EmailData, newRecords: ExtractedRecord[]) => {
    setEmails((prev) => [email, ...prev]);
    if (newRecords.length > 0) {
      setRecords((prev) => [...newRecords, ...prev]);
    }
  };

  const autoSyncInbox = async () => {
    // Simulate network delay for fetching from IMAP
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const sampleEmails = [
      {
        sender: 'broker@stargazermaritime.com',
        subject: 'Open Tonnage - SE Asia',
        body: `MV SHENG AN HAI DWT 56564 OPEN XIAMEN 08-12 JUNE\nMV FENG HUI HAI DWT 63000 OPEN VUNG ANG 2ND JUNE\nMV ZHENG ZHI DWT 65000 OPEN SINGAPORE 15-20 JUNE`
      },
      {
        sender: 'chartering@asiapacific.com',
        subject: 'FIRM CARGO OFFER - 15K MTS',
        body: `22 MAY 2026 \nATTN CHARTERING DESK !\nPLEASE OFFER FIRM FOR FOLL FULY FIRM CARGO\n15,000 - 20,000 MTS 10PCT MOLOCHOPT\nLOAD PORT : KOH SI CHANG , THAILAND\nDISCHARGE PORT: KANDLA + CHENNAI\nLAYCAN: MID JULY 2026\nCOM : 3.75 PCT TTL`
      },
      {
        sender: 'ops@seaschiffe.com',
        subject: 'TC Requirement - 33k dwt',
        body: `Please provide suitable, rated vessels for our following firm requirements.\n* A/C SeaSchiffe\n* 1 TCT with Steels/Gens/lawfuls\n* 33k dwt upto HMAX\n* Delivery: ECI\n* Laycan: 10-17 JUNE\n* Redel: ARAG via COGH transit\n* Duration: abt 50-55 days wog\n* 3.75% Adc`
      }
    ];

    const newEmails: EmailData[] = [];
    const newRecords: ExtractedRecord[] = [];

    sampleEmails.forEach((sample, index) => {
      const category = categorizeEmail(sample.body);
      const emailId = `email-${Date.now()}-${index}`;
      const parsedRecords = parseMaritimeEmail(sample.body, category, emailId);
      
      newEmails.push({
        id: emailId,
        sender: sample.sender,
        subject: sample.subject,
        date: new Date().toLocaleDateString(),
        body: sample.body,
        category,
        extracted: parsedRecords.length > 0
      });
      newRecords.push(...parsedRecords);
    });

    setEmails(newEmails);
    setRecords(newRecords);
    setIsSynced(true);
  };

  return (
    <ShippingContext.Provider value={{ emails, records, addEmail, autoSyncInbox, isSynced }}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
}
