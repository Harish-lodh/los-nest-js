import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LeadKycSubdoc, LeadKycSubdocSchema } from './lead-kyc.entity';

export type LeadDocument = HydratedDocument<Lead>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'leads',
})
export class Lead {
  @Prop({ type: String, trim: true, default: null }) leadOwner?: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 }) firstName!: string;
  @Prop({ type: String, required: true, trim: true, maxlength: 100 }) lastName!: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true, maxlength: 150 })
  email!: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 20 }) mobile!: string;
  @Prop({ type: String, trim: true, maxlength: 150, default: null }) company?: string;

  @Prop({ type: String, trim: true, maxlength: 200, default: null }) street?: string;
  @Prop({ type: String, trim: true, maxlength: 120, default: null }) city?: string;
  @Prop({ type: String, trim: true, maxlength: 120, default: null }) state?: string;
  @Prop({ type: String, trim: true, maxlength: 120, default: null }) country?: string;
  @Prop({ type: String, trim: true, maxlength: 20,  default: null }) zipCode?: string;

  @Prop({ type: String, default: null }) description?: string;

  @Prop({ type: String, trim: true, maxlength: 1024, default: null }) leadImagePath?: string |null;

  @Prop({ type: Object, default: null }) customData?: Record<string, any>;

  @Prop({ type: LeadKycSubdocSchema, default: undefined }) kyc?: LeadKycSubdoc;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
LeadSchema.index({ email: 1 });
LeadSchema.index({ mobile: 1 });
LeadSchema.index({ created_at: -1 });
