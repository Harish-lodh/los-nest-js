// src/leads/dto/create-lead.dto.ts
import { Type } from 'class-transformer';
import { ValidateNested, IsOptional } from 'class-validator';
import { KycDataDto } from './kyc-data.dto';

export class CreateLeadDto {
  @IsOptional()
  formData?: Record<string, any>;   // <-- add this line

  @ValidateNested()
  @Type(() => KycDataDto)
  kycData!: KycDataDto;

  @IsOptional()
  documentsMeta?: { type: string }[];
}
