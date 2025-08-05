"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAadhaarFront = parseAadhaarFront;
exports.parseAadhaarBack = parseAadhaarBack;
function parseAadhaarFront(textLines) {
    const fullText = textLines.join(" ").replace(/\n/g, " ");
    const lines = fullText.split(/\s+/);
    const data = {};
    const aadhaarMatch = fullText.match(/\b\d{4}\s\d{4}\s\d{4}\b/);
    if (aadhaarMatch)
        data.aadhaarNumber = aadhaarMatch[0];
    const dobMatch = fullText.match(/\d{2}\/\d{2}\/\d{4}/);
    if (dobMatch)
        data.dob = dobMatch[0];
    const genderMatch = lines.find(word => ["male", "female", "other"].includes(word.toLowerCase()));
    if (genderMatch) {
        data.gender = genderMatch.charAt(0).toUpperCase() + genderMatch.slice(1).toLowerCase();
    }
    for (let i = 0; i < lines.length - 2; i++) {
        if (/^[A-Z][a-z]+$/.test(lines[i]) &&
            /^[A-Z][a-z]+$/.test(lines[i + 1]) &&
            /^[A-Z][a-z]+$/.test(lines[i + 2])) {
            data.name = `${lines[i]} ${lines[i + 1]} ${lines[i + 2]}`;
            break;
        }
    }
    return data;
}
function parseAadhaarBack(textLines) {
    const asciiOnly = (text) => /^[\x00-\x7F\s,./:-]+$/.test(text);
    const englishLines = textLines
        .map(line => line.trim())
        .filter(line => line.length > 0 && asciiOnly(line));
    console.log('Matched English Lines:', englishLines);
    const startIndex = englishLines.findIndex(line => /(S\/O|C\/O|Address|D\/O|W\/O)/i.test(line));
    let addressBlock;
    if (startIndex !== -1) {
        addressBlock = englishLines.slice(startIndex, startIndex + 6);
    }
    else {
        addressBlock = englishLines.slice(0, 6);
    }
    console.log('Address Block:', addressBlock);
    return addressBlock
        .join(', ')
        .replace(/\s+/g, ' ')
        .replace(/\s+,/g, ',')
        .trim();
}
//# sourceMappingURL=aadhaar-parser.util.js.map