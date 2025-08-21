// src/kyc/kyc.service.ts
import { Injectable } from '@nestjs/common';
import { VerifyKycDto } from './dto/verify-kyc.dto';
import axios from 'axios';

@Injectable()
export class KycService {
  async verifyWithPerfios(data: VerifyKycDto) {
    const url = process.env.PAN_API_URL ?? '';
    const payload = {
      pan: data.panNumber,
      name: data.fullName,
      dob: data.dob,
      consent: "Y",
    };
    console.log(payload);
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-key': process.env.PERFIOS_KEY,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        `Perfios verification failed: ${error.response?.data?.message || error.message}`,
      );
    }
  }
}
