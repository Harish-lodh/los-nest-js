import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class LeadKycSubdoc {
  @Prop({ type: String, trim: true, default: null }) name?: string;
  @Prop({ type: String, trim: true, default: null }) gender?: string;
  @Prop({ type: String, trim: true, default: null }) dob?: string; // keep as string to match old model
  @Prop({ type: String, trim: true, default: null }) aadhaarNumber?: string;
  @Prop({ type: String, default: null }) address?: string;

  @Prop({ type: String, trim: true, default: null }) panNumber?: string;
  @Prop({ type: String, trim: true, default: null }) panHolderName?: string;
  @Prop({ type: String, trim: true, default: null }) panFatherName?: string;
  @Prop({ type: String, trim: true, default: null }) panDob?: string;

  @Prop({ type: String, trim: true, default: null }) aadhaarFrontPath?: string | null;
  @Prop({ type: String, trim: true, default: null }) aadhaarBackPath?: string | null;
  @Prop({ type: String, trim: true, default: null }) panPath?: string | null;
}

export const LeadKycSubdocSchema = SchemaFactory.createForClass(LeadKycSubdoc);
