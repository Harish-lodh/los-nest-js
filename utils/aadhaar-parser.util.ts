export interface AadhaarData {
  name: string;
  gender: string;
  dob: string;
  aadhaarNumber: string;
  address: string;
}

export function parseAadhaarFront(textLines: string[]): Partial<AadhaarData> {
  const fullText = textLines.join(" ").replace(/\n/g, " ");
  const lines = fullText.split(/\s+/);

  const data: Partial<AadhaarData> = {};

  // Aadhaar Number
  const aadhaarMatch = fullText.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
  if (aadhaarMatch) data.aadhaarNumber = aadhaarMatch[0];

  // DOB
  const dobMatch = fullText.match(/\d{2}\/\d{2}\/\d{4}/);
  if (dobMatch) data.dob = dobMatch[0];

  // Gender
  const genderMatch = lines.find(word => ["male", "female", "other"].includes(word.toLowerCase()));
  if (genderMatch) {
    data.gender = genderMatch.charAt(0).toUpperCase() + genderMatch.slice(1).toLowerCase();
  }

  // Name (Three consecutive capitalized words)
  for (let i = 0; i < lines.length - 2; i++) {
    if (
      /^[A-Z][a-z]+$/.test(lines[i]) &&
      /^[A-Z][a-z]+$/.test(lines[i + 1]) &&
      /^[A-Z][a-z]+$/.test(lines[i + 2])
    ) {
      data.name = `${lines[i]} ${lines[i + 1]} ${lines[i + 2]}`;
      break;
    }
  }

  return data;
}

// export function parseAadhaarBack(textLines: string[]): string {
//   const fullText = textLines.join(" ").replace(/\n/g, " ");
//   // Try finding a 6-digit PIN and grab 6 words before it
//   const match = fullText.match(/([A-Za-z0-9,\s]{20,60})\b\d{6}\b/);
//   if (match) return match[0].trim();
//   // fallback
//   return textLines.slice(0, 6).join(" ");
// }


export function parseAadhaarBack(textLines: string[]): string {
  const asciiOnly = (text: string) => /^[\x00-\x7F\s,./:-]+$/.test(text);

  // Step 1: Clean and preserve full lines
  const englishLines = textLines
    .map(line => line.trim())
    .filter(line => line.length > 0 && asciiOnly(line));
console.log('Matched English Lines:', englishLines);
  // Step 2: Try to find address anchor
  const startIndex = englishLines.findIndex(line =>
    /(S\/O|C\/O|Address|D\/O|W\/O)/i.test(line)
  );

  let addressBlock: string[];

  if (startIndex !== -1) {
    // Grab next 4–6 lines
    addressBlock = englishLines.slice(startIndex, startIndex + 6);
  } else {
    // Fallback to first few if anchor not found
    addressBlock = englishLines.slice(0, 6);
  }
console.log('Address Block:', addressBlock);
  // Step 3: Combine into readable address
  return addressBlock
    .join(', ')
    .replace(/\s+/g, ' ')   // normalize spaces
    .replace(/\s+,/g, ',')  // fix spaces before commas
    .trim();
}

