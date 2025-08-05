import { Injectable } from '@nestjs/common';
import * as vision from '@google-cloud/vision';

@Injectable()
export class GoogleVisionService {
  private client: vision.ImageAnnotatorClient;

  constructor() {
    this.client = new vision.ImageAnnotatorClient(); // ✅ Let it auto-pick from env
  }

async extractTextFromImage(imageBuffer: Buffer): Promise<string[]> {
  const [result] = await this.client.textDetection({ image: { content: imageBuffer } });
  const detections = result.textAnnotations || [];

  if (detections.length === 0 || !detections[0].description) {
    return [];
  }

  // ✅ This is the entire block of text
  const fullTextBlock = detections[0].description;

  // ✅ Split into lines
  return fullTextBlock.split('\n').map(line => line.trim()).filter(Boolean);
}

}
