// src/leads/lead.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Express } from 'express';

// Lead entity
import { Lead, LeadDocument } from './entities/lead.entity';

// LeadDocument entity (aliased to avoid name conflict)
import {
  LeadDocument as LeadDocEntity,
  LeadDocumentDocument,
} from './entities/lead-document.entity';

import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(LeadDocEntity.name) private leadDocumentModel: Model<LeadDocumentDocument>,
  ) { }

  async create(
    dto: CreateLeadDto,
    files: {
      leadImage?: Express.Multer.File[];
      aadhaarFront?: Express.Multer.File[];
      aadhaarBack?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ): Promise<LeadDocument> {
    const session = await this.leadModel.db.startSession();
    session.startTransaction();
console.log("dto--",dto)
    try {
      // Save main lead
      const [lead] = await this.leadModel.create(
        [{ leads: dto.formData, kycData: dto.kycData }],
        { session },
      );

      const kycDocuments: Partial<LeadDocEntity>[] = [];
      const additionalDocuments: Partial<LeadDocEntity>[] = [];

      // --- KYC docs
      if (files['aadhaarFront']?.length) {
        kycDocuments.push({
          type: 'aadhaarFront',
          originalName: files['aadhaarFront'][0].originalname,
          fileContent: files['aadhaarFront'][0].buffer,
          lead: lead._id,
        });
      }
      if (files['aadhaarBack']?.length) {
        kycDocuments.push({
          type: 'aadhaarBack',
          originalName: files['aadhaarBack'][0].originalname,
          fileContent: files['aadhaarBack'][0].buffer,
          lead: lead._id,
        });
      }
      if (files['pan']?.length) {
        kycDocuments.push({
          type: 'pan',
          originalName: files['pan'][0].originalname,
          fileContent: files['pan'][0].buffer,
          lead: lead._id,
        });
      }

      // --- Additional docs
      if (files['documents']?.length) {
        files['documents'].forEach((file, index) => {
          additionalDocuments.push({
            type: dto.documentsMeta?.[index]?.type || `document${index + 1}`,
            originalName: file.originalname,
            fileContent: file.buffer,
            lead: lead._id,
          });
        });
      }

      // Save all documents
      const allDocs = [...kycDocuments, ...additionalDocuments];
      if (allDocs.length > 0) {
        await this.leadDocumentModel.insertMany(allDocs, { session });
      }

      await session.commitTransaction();
      return lead;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findAll() {
    return this.leadModel.find().lean().exec();
  }

  async findAllWithDocs() {
    return this.leadModel.aggregate([
      {
        $lookup: {
          from: 'lead_documents',
          localField: '_id',
          foreignField: 'lead',
          as: 'documents',
        },
      },
      { $sort: { created_at: -1 } },
    ]);
  }
}
