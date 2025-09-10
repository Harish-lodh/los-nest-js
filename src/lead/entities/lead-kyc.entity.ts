// src/leads/entities/lead-kyc.subdoc.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // embedded, not a separate collection
export class LeadKycSubdoc {
  @Prop() name?: string;
  @Prop() gender?: string;
  @Prop() dob?: string;
  @Prop() aadhaarNumber?: string;
  @Prop() address?: string;
  @Prop() panNumber?: string;
  @Prop() panHolderName?: string;
  @Prop() panFatherName?: string;
  @Prop() panDob?: string;
}

export const LeadKycSubdocSchema = SchemaFactory.createForClass(LeadKycSubdoc);
