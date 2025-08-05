export declare class GoogleVisionService {
    private client;
    constructor();
    extractTextFromImage(imageBuffer: Buffer): Promise<string[]>;
}
