import { GoogleVisionService } from './google-vision.service';
import { AadhaarData } from '../../utils/aadhaar-parser.util';
import { PanData } from '../../utils/pan-parser.util';
export declare class OcrController {
    private readonly visionService;
    constructor(visionService: GoogleVisionService);
    extractBothSides(files: {
        aadhaarFront?: Express.Multer.File[];
        aadhaarBack?: Express.Multer.File[];
        pan?: Express.Multer.File[];
    }): Promise<{
        aadhaarData: AadhaarData;
        panData: PanData | null;
    }>;
}
