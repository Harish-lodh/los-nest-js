// // src/leads/dto/create-lead.dto.ts
// import { IsEmail, IsOptional, IsString, ValidateNested, IsArray } from 'class-validator';
// import { Type } from 'class-transformer';

// class FormDataDto {
//   @IsOptional() @IsString() leadOwner?: string;
//   @IsString() firstName!: string;
//   @IsString() lastName!: string;
//   @IsEmail() email!: string;
//   @IsString() mobile!: string;
//   @IsOptional() @IsString() company?: string;

//   @IsOptional() @IsString() street?: string;
//   @IsOptional() @IsString() city?: string;
//   @IsOptional() @IsString() state?: string;
//   @IsOptional() @IsString() country?: string;
//   @IsOptional() @IsString() zipCode?: string;

//   @IsOptional() @IsString() description?: string;
// }

// class KycDataDto {
//   @IsOptional() @IsString() name?: string;
//   @IsOptional() @IsString() gender?: string;
//   @IsOptional() @IsString() dob?: string; // yyyy-mm-dd
//   @IsOptional() @IsString() aadhaarNumber?: string;
//   @IsOptional() @IsString() address?: string;

//   @IsOptional() @IsString() panNumber?: string;
//   @IsOptional() @IsString() panHolderName?: string;
//   @IsOptional() @IsString() panFatherName?: string;
//   @IsOptional() @IsString() panDob?: string; // yyyy-mm-dd
// }

// // Aligns with your uploadedDocuments [{id,type:{value,label}, file, uploadedAt}]
// class DocumentMetaDto {
//   @IsString() type!: string;        // 'bank_statement' etc.
//   @IsString() filename!: string;    // file name sent from client for mapping
// }

// export class CreateLeadDto {
//   @ValidateNested() @Type(() => FormDataDto) formData!: FormDataDto;
//   @ValidateNested() @Type(() => KycDataDto) kycData!: KycDataDto;
//   @IsArray() @ValidateNested({ each: true }) @Type(() => DocumentMetaDto)
//   documentsMeta!: DocumentMetaDto[];
// }



// src/leads/dto/create-lead.dto.ts
import { IsString, IsOptional, IsEmail, IsMobilePhone, IsUUID } from 'class-validator';

export class CreateLeadDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  leadOwner?: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsMobilePhone()
  mobile!: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  leadImagePath?: string;

  // Dynamic fields can be any key-value pair
  [key: string]: any;
}