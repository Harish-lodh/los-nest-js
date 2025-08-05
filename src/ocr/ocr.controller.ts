// src/ocr/ocr.controller.ts
import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GoogleVisionService } from './google-vision.service';
import {
  parseAadhaarFront,
  parseAadhaarBack,
  AadhaarData,
} from '../../utils/aadhaar-parser.util';
import { PanData, parsePanText } from '../../utils/pan-parser.util'; // ✅ Import this

@Controller('ocr')
export class OcrController {
  constructor(private readonly visionService: GoogleVisionService) {}

  @Post('extract')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'aadhaarFront', maxCount: 1 },
      { name: 'aadhaarBack', maxCount: 1 },
      { name: 'pan', maxCount: 1 }, // ✅ PAN file support
    ])
  )
  async extractBothSides(
    @UploadedFiles()
    files: {
      aadhaarFront?: Express.Multer.File[];
      aadhaarBack?: Express.Multer.File[];
      pan?: Express.Multer.File[];
    }
  ) {
    const { aadhaarFront, aadhaarBack, pan } = files;

    const aadhaarResult: AadhaarData = {
      name: '',
      gender: '',
      dob: '',
      aadhaarNumber: '',
      address: '',
    };

    let panData: PanData | null = null;


    if (aadhaarFront?.[0]) {
      const frontText = await this.visionService.extractTextFromImage(aadhaarFront[0].buffer);
      const parsedFront = parseAadhaarFront(frontText);
      Object.assign(aadhaarResult, parsedFront);
    }

    if (aadhaarBack?.[0]) {
      const backText = await this.visionService.extractTextFromImage(aadhaarBack[0].buffer);
      aadhaarResult.address = parseAadhaarBack(backText);
    }

    if (pan?.[0]) {
      const panText = await this.visionService.extractTextFromImage(pan[0].buffer);
      panData = parsePanText(panText); // ✅ Extract PAN details
    }

    return {
      aadhaarData: aadhaarResult,
      panData: panData,
    };
  }
}
