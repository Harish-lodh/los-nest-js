import { Module } from '@nestjs/common';

import { GoogleVisionService } from './google-vision.service';

import { OcrController } from './ocr.controller';

@Module({
  controllers: [OcrController],
  providers: [GoogleVisionService],
})
export class OcrModule {}
