import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lead, LeadDocument } from './entities/lead.entity';
import { LeadField, LeadFieldDocument } from './entities/lead-field.schema';

// Fields defined in the Lead schema that cannot be added/deleted as dynamic fields
const CORE_FIELDS = new Set([
  'leadOwner',
  'firstName',
  'lastName',
  'email',
  // 'mobile',
  // 'company',
  // 'street',
  // 'city',
  // 'state',
  // 'country',
  // 'zipCode',
  // 'description',
  // 'leadImagePath',
  // 'aadharNumber',
  // 'addressLine2',
  // 'alternateEmail',
  // 'alternateMobile',
  // 'annualIncome',
  // 'businessType',
  // 'cibilScore',
  // 'dealerCode',
  // 'eNachRegistered',
  // 'emiDayOfMonth',
  // 'emiStartDate',
  // 'employmentType',
  // 'gender',
  // 'gstNumber',
  // 'interestRatePct',
  // 'loanType',
  // 'panNumber',
  // 'referenceContact',
  // 'remarksInternal',
  // 'sanctionAmount',
  // 'yearsInBusiness',
  // 'kyc',
  // '_id',
  // 'created_at',
  // 'updated_at',
  // 'customData',
]);

@Injectable()
export class LeadFieldsService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    @InjectModel(LeadField.name) private readonly fieldModel: Model<LeadFieldDocument>,
  ) {}

  async getColumns() {
    // Fetch all non-deleted fields from LeadField collection
    const fields = await this.fieldModel
      .find({ isDeleted: false })
      .sort({ name: 1 })
      .lean();

    // Map to the desired format, excluding internal fields
    return fields
      .filter((f) => !['_id', 'created_at', 'updated_at', 'kyc', 'customData'].includes(f.name))
      .map((f) => ({
        name: f.name,
        dbType: f.uiType,
        isNullable: f.isNullable,
      }));
  }

  async addColumn(name: string, uiType: string, isNullable = true) {
    name = (name || '').trim();
    if (!name || !uiType) throw new BadRequestException('Name and uiType are required');

    if (CORE_FIELDS.has(name))
      throw new ForbiddenException(`'${name}' is a reserved field; cannot add as dynamic field.`);

    // Upsert: if the field was soft-deleted, revive it
    const doc = await this.fieldModel
      .findOneAndUpdate(
        { name },
        { $set: { uiType, isNullable, isDeleted: false } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      )
      .lean();

    // Optionally initialize the field in customData for existing leads
    await this.leadModel.updateMany(
      { [`customData.${name}`]: { $exists: false } },
      { $set: { [`customData.${name}`]: null } },
    );

    return doc;
  }

  async deleteColumn(name: string) {
    name = (name || '').trim();
    if (!name) throw new BadRequestException('Name is required');

    if (CORE_FIELDS.has(name))
      throw new ForbiddenException(`'${name}' is a reserved field; cannot delete.`);

    const updated = await this.fieldModel
      .findOneAndUpdate({ name }, { $set: { isDeleted: true } }, { new: true })
      .lean();

    if (!updated) throw new NotFoundException('Field not found');

    // Soft delete: keep data in customData intact, just hide in UI
    return { deleted: true };
  }
}