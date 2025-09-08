// lead-kyc.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('lead_kyc')
export class LeadKyc {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ---------- extracted fields ----------
  @Column({ type: 'varchar', length: 150, nullable: true }) name!: string | null;
  @Column({ type: 'varchar', length: 20,  nullable: true }) gender!: string | null;
  @Column({ type: 'date',               nullable: true })   dob!: string | null;
  @Column({ type: 'varchar', length: 20,  nullable: true }) aadhaarNumber!: string | null;
  @Column({ type: 'text',               nullable: true })   address!: string | null;

  @Column({ type: 'varchar', length: 20,  nullable: true }) panNumber!: string | null;
  @Column({ type: 'varchar', length: 150, nullable: true }) panHolderName!: string | null;
  @Column({ type: 'varchar', length: 150, nullable: true }) panFatherName!: string | null;
  @Column({ type: 'date',               nullable: true })   panDob!: string | null;

  // ---------- file path columns (STRING!) ----------
  @Column({ type: 'varchar', length: 1024, nullable: true })
  aadhaarFrontPath!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  aadhaarBackPath!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  panPath!: string | null;

  @OneToOne(() => Lead, (lead) => lead.kyc)
  lead!: Lead;
}
