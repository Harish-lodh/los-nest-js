import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { LeadService } from './lead.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateLeadDto } from './dto/create-lead.dto';
@Controller('leads')
@ApiTags('Leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  // @Post('upload')
  // @UseInterceptors(FilesInterceptor('documents', 10))
  // @ApiBody({
  //   description: 'Lead creation with document upload',
  //   type: CreateLeadDto,
  // })
  // async uploadDocuments(
  //   @Body() createLeadDto: CreateLeadDto,
  //   @UploadedFiles() files: Express.Multer.File[],
  // ) {
  //   return this.leadService.handleDocumentUpload(createLeadDto, files);
  // }
}
