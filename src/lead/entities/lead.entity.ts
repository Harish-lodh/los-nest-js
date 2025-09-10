// src/leads/entities/lead.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LeadKycSubdoc, LeadKycSubdocSchema } from './lead-kyc.entity';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'leads',
})
export class Lead {
  @Prop({ type: Object, default: {} })
  leads: Record<string, any>;   // dynamic form fields

  @Prop({ type: LeadKycSubdocSchema, default: {} })
  kycData: LeadKycSubdoc;           // strongly typed subdocument
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ created_at: -1 });
