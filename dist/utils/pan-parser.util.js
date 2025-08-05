"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePanText = parsePanText;
function parsePanText(lines) {
    const fullText = lines.join(' ').replace(/\n/g, ' ');
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/;
    const dobRegex = /\d{2}\/\d{2}\/\d{4}/;
    let panNumber = fullText.match(panRegex)?.[0] || '';
    let dob = fullText.match(dobRegex)?.[0] || '';
    let name = '';
    let fatherName = '';
    const nameLine = lines.find(line => /Name/i.test(line) && !/Father/i.test(line));
    const nameIndex = lines.indexOf(nameLine || '');
    if (nameIndex !== -1 && lines[nameIndex + 1]) {
        name = lines[nameIndex + 1].trim();
    }
    const fatherLine = lines.find(line => /Father/i.test(line));
    const fatherIndex = lines.indexOf(fatherLine || '');
    if (fatherIndex !== -1 && lines[fatherIndex + 1]) {
        fatherName = lines[fatherIndex + 1].trim();
    }
    return {
        panNumber,
        dob,
        name,
        fatherName,
    };
}
//# sourceMappingURL=pan-parser.util.js.map