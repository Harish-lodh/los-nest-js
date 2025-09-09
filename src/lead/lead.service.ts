// src/leads/leads.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';

// Schemas
import { Lead, LeadDocument } from './entities/lead.entity';
import {
  LeadDocument as LeadDoc,
  LeadDocumentDocument,
} from './entities/lead-document.entity';

// If you still use LeadFieldsService elsewhere, inject it here; otherwise remove.
@Injectable()
export class LeadsService {
  constructor(
    @InjectModel(Lead.name)
    private readonly leadModel: Model<LeadDocument>,

    @InjectModel(LeadDoc.name)
    private readonly leadDocModel: Model<LeadDocumentDocument>,
  ) {}

  async create(
    dto: CreateLeadDto,
    files: {
      leadImage?: Express.Multer.File[];
      aadhaarFront?: Express.Multer.File[];
      aadhaarBack?: Express.Multer.File[];
      pan?: Express.Multer.File[];
      documents?: Express.Multer.File[];
    },
  ) {
    // Build lead document
    const leadPayload: Partial<Lead> = {
      ...dto.formData, // firstName, lastName, email, mobile, address fields, etc.
      leadImagePath: files.leadImage?.[0]?.path ?? null,
      kyc: {
        ...(dto.kycData || {}),
        aadhaarFrontPath: files.aadhaarFront?.[0]?.path ?? null,
        aadhaarBackPath: files.aadhaarBack?.[0]?.path ?? null,
        panPath: files.pan?.[0]?.path ?? null,
      },
      // customData is allowed as object; keep if provided
      ...(dto as any).customData ? { customData: (dto as any).customData } : {},
    };

    // Create lead
    const createdLead = await this.leadModel.create(leadPayload);
    const leadId = createdLead._id as Types.ObjectId;

    // Map documents (variable list) using meta array + uploaded files in order
    const docsToInsert: Array<Pick<LeadDoc, 'type' | 'originalName' | 'path'> & { lead: Types.ObjectId }> = [];
    const uploadedDocs = files.documents || [];
    (dto.documentsMeta || []).forEach((meta, idx) => {
      const f = uploadedDocs[idx];
      if (!f) return;
      docsToInsert.push({
        type: meta.type,
        originalName: f.originalname,
        path: f.path,
        lead: leadId,
      });
    });

    // Insert many (if any)
    if (docsToInsert.length > 0) {
      await this.leadDocModel.insertMany(docsToInsert);
    }

    // Return the lead object; you can also include docs if you want:
    const result = createdLead.toObject();
    return {
      ...result,
      documentsCount: docsToInsert.length,
    };
  }

  async findAll() {
    // Return leads sorted by created_at desc (we mapped timestamps to created_at/updated_at)
    // If you want the documents inline, you can $lookup; keeping it simple here.
    return this.leadModel.find().sort({ created_at: -1 }).lean().exec();
  }

  // Optional helpers if you need them later:

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Lead not found');
    const lead = await this.leadModel.findById(id).lean().exec();
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async listDocuments(leadId: string) {
    if (!Types.ObjectId.isValid(leadId)) throw new NotFoundException('Lead not found');
    return this.leadDocModel.find({ lead: leadId }).sort({ createdAt: -1 }).lean().exec();
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException('Lead not found');
    const deleted = await this.leadModel.findByIdAndDelete(id).lean();
    if (!deleted) throw new NotFoundException('Lead not found');
    await this.leadDocModel.deleteMany({ lead: new Types.ObjectId(id) });
    return { deleted: true };
  }
}
