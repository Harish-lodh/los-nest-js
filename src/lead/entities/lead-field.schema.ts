import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LeadFieldDocument = HydratedDocument<LeadField>;

@Schema({ collection: 'lead_fields', timestamps: true })
export class LeadField {
  @Prop({ type: String, required: true, trim: true, lowercase: false })
  name!: string;

  @Prop({ type: String, required: true, trim: true })
  uiType!: string;

  @Prop({ type: Boolean, default: true })
  isNullable!: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted!: boolean;
}

export const LeadFieldSchema = SchemaFactory.createForClass(LeadField);
LeadFieldSchema.index({ name: 1 }, { unique: true });