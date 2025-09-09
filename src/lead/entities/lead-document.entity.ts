import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LeadDocumentDocument = HydratedDocument<LeadDocument>;

@Schema({ timestamps: true, collection: 'lead_documents' })
export class LeadDocument {
  @Prop({ required: true, trim: true, maxlength: 64 })
  type!: string;

  @Prop({ required: true, trim: true, maxlength: 255 })
  originalName!: string;

  @Prop({ required: true, trim: true, maxlength: 1024 })
  path!: string;

  @Prop({ type: Types.ObjectId, ref: 'Lead', required: true })
  lead!: Types.ObjectId; // references Lead._id
}

export const LeadDocumentSchema = SchemaFactory.createForClass(LeadDocument);

// Helpful index for lookups by lead
LeadDocumentSchema.index({ lead: 1, createdAt: -1 });
