// src/leads/lead-fields.service.ts
import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class LeadFieldsService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // ✅ Keep this set *lowercase* because we compare lowercased names
  private readonly PROTECTED_COLUMNS = new Set([
    'id',
    'created_at',
    'updated_at',
    'status',
    'lan',
    'partner_loan_id',
    'leadowner',
    'firstname',
    'lastname',
    'email',
    'mobile',
    'company',
    'street',
    'city',
    'state',
    'country',
    'zipcode',
    'description',
    'leadimagepath',
    'customdata',
  ]);

  private readonly UI_TYPE_TO_DB_TYPE: Record<string, string> = {
    text: 'VARCHAR(255)',
    email: 'VARCHAR(255)',
    number: 'NUMERIC(15,2)',
    int: 'INTEGER',
    date: 'DATE',
  };

  // Simple default per type when NOT NULL is requested
  private defaultFor(dbType: string): string {
    const t = dbType.toUpperCase();
    if (t.startsWith('VARCHAR')) return `''`;
    if (t.startsWith('NUMERIC')) return `0`;
    if (t.startsWith('INTEGER')) return `0`;
    if (t === 'DATE') return `CURRENT_DATE`;
    return `''`;
  }

  async getColumns() {
    const query = `   
      SELECT
        column_name    AS name,
        data_type      AS dbType,
        is_nullable    AS isNullable
      FROM information_schema.columns
      WHERE table_name = 'leads'
        AND table_schema = 'public'
        AND column_name NOT IN ('customData', 'id', 'kycId', 'leadImagePath','created_at','updated_at')
      ORDER BY ordinal_position
    `;
    const rows = await this.dataSource.query(query);
   // console.log(rows)
    return rows.map((col: any) => ({
      name: col.name ?? col.column_name,
      dbType: (col.dbtype ?? 'UNKNOWN').toUpperCase(),
      isNullable: (col.isnullable ?? col.isNullable ) === 'YES',
    }));
  }

  async addColumn(name: string, uiType: string, isNullable: boolean) {
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, '_');
    if (!cleanName.match(/^[a-z_][a-z0-9_]*$/)) {
      throw new BadRequestException(
        'Invalid column name. Use letters, numbers, and underscores; must start with a letter/underscore.'
      );
    }

    const existing = await this.getColumns();
    if (existing.some((c: any) => c.name.toLowerCase() === cleanName)) {
      throw new BadRequestException(`Column '${cleanName}' already exists`);
    }

    const dbType = this.UI_TYPE_TO_DB_TYPE[uiType];
    if (!dbType) throw new BadRequestException(`Invalid type: ${uiType}`);

    // ⚠️ Postgres: NOT NULL requires a default or a two-step change
    return this.dataSource.transaction(async (qr) => {
      if (isNullable) {
        // Simple path
        await qr.query(`ALTER TABLE leads ADD COLUMN "${cleanName}" ${dbType} NULL`);
      } else {
        // Safe NOT NULL path: add with DEFAULT, backfilled instantly by PG, then drop default
        const def = this.defaultFor(dbType);
        await qr.query(`ALTER TABLE leads ADD COLUMN "${cleanName}" ${dbType} DEFAULT ${def}`);
        await qr.query(`ALTER TABLE leads ALTER COLUMN "${cleanName}" SET NOT NULL`);
        await qr.query(`ALTER TABLE leads ALTER COLUMN "${cleanName}" DROP DEFAULT`);
      }

      return { message: `Column '${cleanName}' added successfully` };
    });
  }

  async deleteColumn(name: string) {
    const cleanName = name.trim().toLowerCase();
    if (this.PROTECTED_COLUMNS.has(cleanName)) {
      throw new ForbiddenException(`Column '${cleanName}' is protected and cannot be deleted`);
    }
    const existing = await this.getColumns();
    if (!existing.some((c: any) => c.name.toLowerCase() === cleanName)) {
      throw new BadRequestException(`Column '${cleanName}' does not exist`);
    }
    await this.dataSource.query(`ALTER TABLE leads DROP COLUMN "${cleanName}"`);
    return { message: `Column '${cleanName}' deleted successfully` };
  }
}
