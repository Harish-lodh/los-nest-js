import { IsString, IsOptional, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  leadOwner: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber()
  mobile: string;

  @IsEmail()
  email: string;

  @IsString()
  company: string;

  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  description: string;
}
