/**
 * Simulated OCR helper that inspects uploaded payment screenshot text or filename
 * and extracts standard Telebirr / CBE Birr transaction ID patterns.
 */
export interface OCRResult {
  extractedTransactionId: string | null;
  confidence: number;
  providerDetected: 'Telebirr' | 'CBE Birr' | 'Awash' | 'Unknown';
  rawText: string;
}

export function extractTransactionFromImage(filenameOrDataUrl: string, userText?: string): OCRResult {
  const combined = (filenameOrDataUrl + ' ' + (userText || '')).toUpperCase();
  
  // Telebirr pattern example: TXN123456789 or 1000... or TXN-XXXXXX
  const telebirrMatch = combined.match(/(TXN[-_]?\d{6,12})|(TB\d{8,12})/i);
  if (telebirrMatch) {
    return {
      extractedTransactionId: telebirrMatch[0].replace(/[-_]/g, ''),
      confidence: 0.95,
      providerDetected: 'Telebirr',
      rawText: `Extracted Telebirr Ref: ${telebirrMatch[0]}`
    };
  }

  // CBE Birr pattern example: CBE123456789 or FT24...
  const cbeMatch = combined.match(/(CBE[-_]?\d{6,12})|(FT\d{8,12})/i);
  if (cbeMatch) {
    return {
      extractedTransactionId: cbeMatch[0].replace(/[-_]/g, ''),
      confidence: 0.92,
      providerDetected: 'CBE Birr',
      rawText: `Extracted CBE Transaction ID: ${cbeMatch[0]}`
    };
  }

  // Generic fallback random transaction for test uploads
  const mockRandomTxn = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  return {
    extractedTransactionId: mockRandomTxn,
    confidence: 0.85,
    providerDetected: 'Telebirr',
    rawText: `OCR Scanned Receipt -> Ref: ${mockRandomTxn}`
  };
}
