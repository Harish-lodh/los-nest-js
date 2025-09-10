// src/lead/lead.module.ts  (or src/leads/leads.module.ts)
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Lead, LeadSchema } from './entities/lead.entity';
import { LeadDocument, LeadDocumentSchema } from './entities/lead-document.entity';

import { LeadsService } from './lead.service';
import { LeadsController } from './lead.controller';
import { LeadField, LeadFieldSchema } from './entities/lead-field.schema'; // <-- add this
import { LeadFieldsService } from './lead-fields.service';
import { LeadFieldsController } from './lead-fields.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Lead.name, schema: LeadSchema },
      { name: LeadDocument.name, schema: LeadDocumentSchema },
      { name: LeadField.name, schema: LeadFieldSchema },

    ]),
  ],
  providers: [LeadsService, LeadFieldsService],
  controllers: [LeadsController, LeadFieldsController],
  exports: [LeadsService, MongooseModule],
})
export class LeadsModule { }
