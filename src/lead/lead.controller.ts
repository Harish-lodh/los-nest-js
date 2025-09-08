// src/leads/leads.controller.ts
import {
  Body, Controller, Post, UploadedFiles, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { uploadsStorage } from './multer.config';
import { LeadsService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'leadImage', maxCount: 1 },
        { name: 'aadhaarFront', maxCount: 1 },
        { name: 'aadhaarBack', maxCount: 1 },
        { name: 'pan', maxCount: 1 },
        { name: 'documents', maxCount: 20 }, // variable list
      ],
      { storage: uploadsStorage }
    ),
  )
  async createLead(
    @UploadedFiles() files: {
      leadImage?: Express.Multer.File[];
      aadhaarFront?: Express.Multer.File[];
      aadhaarBack?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
    @Body('payload') payload: string,
  ) {
    if (!payload) throw new BadRequestException('Missing payload JSON');

    const parsed = JSON.parse(payload);
    const dto = plainToInstance(CreateLeadDto, parsed);
    await validateOrReject(dto).catch((e) => {
      throw new BadRequestException(e);
    });

    return this.leadsService.create(dto, files);
  }
}
