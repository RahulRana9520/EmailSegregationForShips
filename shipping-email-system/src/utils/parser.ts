export type EmailCategory = 'Tonnage' | 'Cargo VC' | 'Cargo TC' | 'Unknown';

export interface BaseExtractedData {
  id: string;
  emailId: string;
  category: EmailCategory;
  accountName: string;
}

export interface TonnageData extends BaseExtractedData {
  category: 'Tonnage';
  vesselName: string;
  openPort: string;
  openDate: string;
  vesselType: string;
  vesselSize: string;
}

export interface CargoVCData extends BaseExtractedData {
  category: 'Cargo VC';
  cargoName: string;
  loadingPort: string;
  dischargePort: string;
  laycan: string;
  cargoType: string;
}

export interface CargoTCData extends BaseExtractedData {
  category: 'Cargo TC';
  deliveryPort: string;
  redeliveryPort: string;
  duration: string;
  cargoName: string;
  laycan: string;
  cargoType: string;
}

export type ExtractedRecord = TonnageData | CargoVCData | CargoTCData;

export function categorizeEmail(text: string): EmailCategory {
  const t = text.toUpperCase();
  
  // Rule-based categorization heuristics
  if (t.includes('TCT ') || t.includes('TIME CHARTER') || t.includes('DURATION ABT')) {
    return 'Cargo TC';
  }
  
  if (t.includes('FIOS') || t.includes('LOAD RATE') || t.includes('DISCHARGE RATE') || t.includes('MOLOCHOPT') || t.includes('POL:') || t.includes('POD:')) {
    return 'Cargo VC';
  }
  
  if (t.includes('OPEN AS FOLLOWS') || t.includes('OPEN ') || t.includes('DWT ON') || t.includes('VSL PARTICULAR') || t.includes('SPEED/CONSUMPTION')) {
    return 'Tonnage';
  }
  
  return 'Unknown';
}

function extractAccountName(text: string): string {
  // Try to find an account name near the top
  const accMatch = text.match(/P R I M E\s+M A R I T I M E/i) || text.match(/ACC\s+([^\n]+)/i) || text.match(/A\/C\s+([^\n]+)/i);
  if (accMatch) {
    if (accMatch[0].includes('PRIME')) return 'PRIME MARITIME';
    return accMatch[1].trim();
  }
  return 'Unknown';
}

export function parseMaritimeEmail(text: string, emailId: string): ExtractedRecord[] {
  const category = categorizeEmail(text);
  const records: ExtractedRecord[] = [];
  const accountName = extractAccountName(text);

  if (category === 'Tonnage') {
    // A single email might contain multiple vessels (e.g. MV SHENG AN HAI, MV FENG HUI HAI)
    // We split by 'MV ' or 'M/V '
    const blocks = text.split(/(?=MV\s|M\/V\s)/gi).slice(1); // skip intro block
    
    // If no MV found, maybe it's a single vessel email without 'MV '
    if (blocks.length === 0) {
      blocks.push(text);
    }

    blocks.forEach((block, index) => {
      // Vessel Name
      let vesselName = 'Unknown';
      const vNameMatch = block.match(/(?:MV|M\/V)\s+([A-Z0-9\s]{3,20})(?:\s+DWT|\n|20|\/)/i);
      if (vNameMatch) vesselName = vNameMatch[1].trim();

      // Open Port
      let openPort = 'Unknown';
      const portMatch = block.match(/OPEN\s+([A-Z\s,]+)\s+O\/A/i) || block.match(/OPEN\s+([A-Z\s,]+)\s+\d{1,2}/i);
      if (portMatch) openPort = portMatch[1].trim();

      // Open Date
      let openDate = 'Unknown';
      const dateMatch = block.match(/O\/A\s+([A-Z0-9\s]+)\n/i) || block.match(/OPEN [^\n]+?(\d{1,2}[A-Z\s-]{2,10})/i);
      if (dateMatch) openDate = dateMatch[1].trim();

      // DWT / Size
      let vesselSize = 'Unknown';
      const sizeMatch = block.match(/DWT\s+([\d,.]+)/i) || block.match(/([\d,.]+)\s*DWT/i) || block.match(/(\d{2,3}K)/i);
      if (sizeMatch) vesselSize = sizeMatch[1].trim();

      records.push({
        id: emailId + '-' + index,
        emailId,
        category: 'Tonnage',
        accountName,
        vesselName,
        openPort,
        openDate,
        vesselType: 'Bulk Carrier', // Defaulting for this context
        vesselSize
      } as TonnageData);
    });
  } 
  else if (category === 'Cargo VC') {
    const blocks = text.split(/\+{10,}|={10,}/).filter(b => b.trim().length > 20);
    
    blocks.forEach((block, index) => {
      if (!block.toUpperCase().includes('CARGO') && !block.toUpperCase().includes('MTS')) return;

      const lpMatch = block.match(/(?:LOAD PORT|LP|POL)[:\s]+([^\n]+)/i);
      const dpMatch = block.match(/(?:DISCHARGE PORT|DP|POD)[:\s]+([^\n]+)/i);
      const laycanMatch = block.match(/(?:LAYCAN|25-30|16-20|MID)[^\n]+/i); // Crude regex for laycan line
      const qtyMatch = block.match(/([\d,]+\s*-\s*[\d,]+|[\d,]+)\s*mts\s+([^\n]+)/i);

      records.push({
        id: emailId + '-' + index,
        emailId,
        category: 'Cargo VC',
        accountName,
        cargoName: qtyMatch ? qtyMatch[2].trim() : 'Unknown Cargo',
        loadingPort: lpMatch ? lpMatch[1].trim() : 'Unknown',
        dischargePort: dpMatch ? dpMatch[1].trim() : 'Unknown',
        laycan: laycanMatch ? laycanMatch[0].trim() : 'Unknown',
        cargoType: 'Bulk',
      });
    });
  }
  else if (category === 'Cargo TC') {
    const blocks = text.split(/\+{10,}|={10,}|\-{10,}/).filter(b => b.trim().length > 20);

    blocks.forEach((block, index) => {
      if (!block.toUpperCase().includes('TCT') && !block.toUpperCase().includes('DELIVERY')) return;

      const delMatch = block.match(/DELIVERY(?:\s+TM)?[:\s]+([^\n]+)/i) || block.match(/DELY(?:\s+TO\s+MAKE)?[:\s]+([^\n]+)/i);
      const redelMatch = block.match(/REDELIVERY[:\s]+([^\n]+)/i) || block.match(/REDEL[:\s]+([^\n]+)/i);
      const durMatch = block.match(/DURATION[:\s]+([^\n]+)/i);
      const laycanMatch = block.match(/(?:LAYCAN|LC)[:\s]+([^\n]+)/i);
      const cargoMatch = block.match(/WITH\s+([^\n]+)/i);

      records.push({
        id: emailId + '-' + index,
        emailId,
        category: 'Cargo TC',
        accountName: extractAccountName(block) !== 'Unknown' ? extractAccountName(block) : accountName,
        deliveryPort: delMatch ? delMatch[1].trim() : 'WW',
        redeliveryPort: redelMatch ? redelMatch[1].trim() : 'WW',
        duration: durMatch ? durMatch[1].trim() : 'Unknown',
        cargoName: cargoMatch ? cargoMatch[1].trim() : 'Unknown',
        laycan: laycanMatch ? laycanMatch[1].trim() : 'Unknown',
        cargoType: 'Time Charter'
      });
    });
  }

  return records;
}
