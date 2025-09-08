// src/leads/leads.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { LeadKyc } from './entities/lead-kyc.entity';
import { LeadDocument } from './entities/lead-document.entity';
import { LeadsController } from './lead.controller';
import { LeadsService } from './lead.service';
import { LeadFieldsController } from './lead-fields.controller';
import { LeadFieldsService } from './lead-fields.service';

@Module({
  imports: [TypeOrmModule.forFeature([Lead, LeadKyc, LeadDocument])],
  controllers: [LeadsController,LeadFieldsController],
  providers: [LeadsService,LeadFieldsService],
})
export class LeadsModule {}
