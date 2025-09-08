// src/leads/lead-fields.service.ts
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LeadFieldsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // Protected columns that cannot be deleted
  private readonly PROTECTED_COLUMNS = new Set([
    'id',
    'created_at',
    'updated_at',
    'status',
    'lan',
    'partner_loan_id',
    'leadOwner',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'company',
    'street',
    'city',
    'state',
    'country',
    'zipCode',
    'description',
    'leadImagePath',
    'customData',
  ]);

  // Map UI types to PostgreSQL column types
  private readonly UI_TYPE_TO_DB_TYPE: Record<string, string> = {
    text: 'VARCHAR(255)',
    email: 'VARCHAR(255)',
    number: 'NUMERIC(15,2)',
    int: 'INTEGER',
    date: 'DATE',
  };

  // Fetch all columns of the leads table
  async getColumns() {
    const query = `SELECT column_name AS name, data_type AS dbType, is_nullable AS isNullable
      FROM information_schema.columns
      WHERE table_name = 'leads' AND table_schema = 'public' AND column_name NOT IN ('customData', 'id', 'kycId', 'leadImagePath') `;
    const columns = await this.dataSource.query(query);
    console.log('Raw query results:', JSON.stringify(columns, null, 2)); // Debug log
    return columns.map((col: any) => ({
      name: col.name || col.column_name,
      dbType: (col.dbtype || col.data_type || 'UNKNOWN').toUpperCase(),
      isNullable: (col.isNullable || col.is_nullable) === 'YES',
    }));
  }

  // Add a new column to the leads table
  async addColumn(name: string, uiType: string) {
    // Validate column name
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanName.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
      throw new BadRequestException('Invalid column name. Use letters, numbers, and underscores only.');
    }

    // Check if column already exists
    const existingColumns = await this.getColumns();
    if (existingColumns.some((col: any) => col.name.toLowerCase() === cleanName)) {
      throw new BadRequestException(`Column '${cleanName}' already exists`);
    }

    // Validate UI type
    const dbType = this.UI_TYPE_TO_DB_TYPE[uiType];
    if (!dbType) {
      throw new BadRequestException(`Invalid type: ${uiType}`);
    }

    // Run ALTER TABLE to add the column
    const query = `ALTER TABLE leads ADD COLUMN "${cleanName}" ${dbType} NULL`;
    await this.dataSource.query(query);

    return { message: `Column '${cleanName}' added successfully` };
  }

  // Delete a column from the leads table
  async deleteColumn(name: string) {
    const cleanName = name.trim().toLowerCase();
    if (this.PROTECTED_COLUMNS.has(cleanName)) {
      throw new ForbiddenException(`Column '${cleanName}' is protected and cannot be deleted`);
    }

    // Check if column exists
    const existingColumns = await this.getColumns();
    console.log(existingColumns)
    if (!existingColumns.some((col: any) => col.name.toLowerCase() === cleanName)) {
      throw new BadRequestException(`Column '${cleanName}' does not exist`);
    }

    // Run ALTER TABLE to drop the column
    const query = `ALTER TABLE leads DROP COLUMN "${cleanName}"`;
    await this.dataSource.query(query);

    return { message: `Column '${cleanName}' deleted successfully` };
  }
}