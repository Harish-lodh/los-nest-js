import { Injectable } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LeadService {
  async handleDocumentUpload(createLeadDto: CreateLeadDto, files: Express.Multer.File[]) {
    try {
      // Store uploaded files
      const uploadPath = './uploads/';
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);
      }

      const savedFiles = files.map(file => {
        const filePath = path.join(uploadPath, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return {
          filename: file.originalname,
          path: filePath,
        };
      });

      // Process the lead data and store in database if needed
      const leadData = {
        ...createLeadDto,
        documents: savedFiles,
      };

      // Here, you would typically save the leadData to your database.
      return { message: 'Documents and lead data uploaded successfully', leadData };
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw new Error('Error uploading documents');
    }
  }
}
