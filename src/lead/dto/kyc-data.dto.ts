// src/leads/dto/kyc-data.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class KycDataDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  dob?: string;

  @IsOptional()
  @IsString()
  aadhaarNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  panNumber?: string;

  @IsOptional()
  @IsString()
  panHolderName?: string;

  @IsOptional()
  @IsString()
  panFatherName?: string;

  @IsOptional()
  @IsString()
  panDob?: string;
}
