// src/leads/entities/lead-document.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeadDocumentDocument = HydratedDocument<LeadDocument>;

@Schema({ timestamps: true, collection: 'lead_documents' })
export class LeadDocument {
  @Prop({ required: true, trim: true, maxlength: 64 })
  type!: string;

  @Prop({ required: true, trim: true, maxlength: 255 })
  originalName!: string;

  @Prop({ required: true, type: Buffer })
  fileContent!: Buffer;

  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  lead!: Types.ObjectId;
}

export const LeadDocumentSchema = SchemaFactory.createForClass(LeadDocument);
LeadDocumentSchema.index({ lead: 1, createdAt: -1 });
