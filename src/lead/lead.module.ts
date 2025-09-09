// src/lead/lead.module.ts  (or src/leads/leads.module.ts)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Lead, LeadSchema } from './entities/lead.entity';
import { LeadDocument, LeadDocumentSchema } from './entities/lead-document.entity';

import { LeadsService } from './lead.service';
import { LeadsController } from './lead.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadDocument.name, schema: LeadDocumentSchema },
    ]),
  ],
  providers: [LeadsService],
  controllers: [LeadsController],
  exports: [LeadsService, MongooseModule],
})
export class LeadsModule {}
