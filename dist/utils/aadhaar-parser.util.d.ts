export interface AadhaarData {
    name: string;
    gender: string;
    dob: string;
    aadhaarNumber: string;
    address: string;
}
export declare function parseAadhaarFront(textLines: string[]): Partial<AadhaarData>;
export declare function parseAadhaarBack(textLines: string[]): string;
