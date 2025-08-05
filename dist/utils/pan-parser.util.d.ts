export interface PanData {
    panNumber: string;
    name: string;
    fatherName: string;
    dob: string;
}
export declare function parsePanText(lines: string[]): {
    panNumber: string;
    dob: string;
    name: string;
    fatherName: string;
};
