// src/leads/lead-fields.controller.ts
import { Controller, Get, Post, Delete, Body, Param, BadRequestException, ForbiddenException } from '@nestjs/common';
import { LeadFieldsService } from './lead-fields.service';

@Controller('lead-fields')
export class LeadFieldsController {
  constructor(private readonly leadFieldsService: LeadFieldsService) {}

  @Get()
  async getColumns() {
    return this.leadFieldsService.getColumns();
  }

  @Post()
  async addColumn(@Body() body: { name: string; uiType: string }) {
    const { name, uiType } = body;
    if (!name || !uiType) {
      throw new BadRequestException('Name and uiType are required');
    }
    return this.leadFieldsService.addColumn(name, uiType);
  }

  @Delete(':name')
  async deleteColumn(@Param('name') name: string) {
    return this.leadFieldsService.deleteColumn(name);
  }
}