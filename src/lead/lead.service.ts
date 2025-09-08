// src/leads/leads.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { LeadKyc } from './entities/lead-kyc.entity';
import { LeadDocument } from './entities/lead-document.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadFieldsService } from './lead-fields.service';

@Injectable()
export class LeadsService {
  constructor(
    @InjectRepository(Lead) private readonly leadRepo: Repository<Lead>,
    @InjectRepository(LeadKyc) private readonly kycRepo: Repository<LeadKyc>,
    @InjectRepository(LeadDocument) private readonly docRepo: Repository<LeadDocument>,
    private readonly leadFieldsService: LeadFieldsService,
  ) {}

  async create(dto: CreateLeadDto, files: {
    leadImage?: Express.Multer.File[];
    aadhaarFront?: Express.Multer.File[];
    aadhaarBack?: Express.Multer.File[];
    pan?: Express.Multer.File[];
    documents?: Express.Multer.File[];
  }) {
    const lead = new Lead();

    // map formData
    Object.assign(lead, dto.formData);

    // map single images
    lead.leadImagePath = files.leadImage?.[0]?.path || null;

    // KYC
    const kyc = new LeadKyc();
    Object.assign(kyc, dto.kycData);
    kyc.aadhaarFrontPath = files.aadhaarFront?.[0]?.path || null;
    kyc.aadhaarBackPath = files.aadhaarBack?.[0]?.path || null;
    kyc.panPath = files.pan?.[0]?.path || null;
    lead.kyc = kyc;

    // Documents (map by index to meta)
    const docs: LeadDocument[] = [];
    const uploaded = files.documents || [];
    dto.documentsMeta?.forEach((meta, idx) => {
      const f = uploaded[idx];
      if (!f) return;
      const d = new LeadDocument();
      d.type = meta.type;
      d.originalName = f.originalname;
      d.path = f.path;
      docs.push(d);
    });
    lead.documents = docs;

    return await this.leadRepo.save(lead);
  }
}
