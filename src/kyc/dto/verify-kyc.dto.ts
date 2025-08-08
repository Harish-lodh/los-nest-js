// src/kyc/dto/verify-kyc.dto.ts
export class VerifyKycDto {
  aadhaarNumber: string;
  panNumber: string;
  fullName: string;
  dob: string; // Format: yyyy-mm-dd
}
