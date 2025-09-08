// src/leads/lead.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { LeadKyc } from './lead-kyc.entity';
import { LeadDocument } from './lead-document.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 150, nullable: true }) leadOwner!: string | null;
  @Column({ type: 'varchar', length: 100 }) firstName!: string;
  @Column({ type: 'varchar', length: 100 }) lastName!: string;
  @Column({ type: 'varchar', length: 150 }) email!: string;
  @Column({ type: 'varchar', length: 20 }) mobile!: string;
  @Column({ type: 'varchar', length: 150, nullable: true }) company!: string | null;

  @Column({ type: 'varchar', length: 200, nullable: true }) street!: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) city!: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) state!: string | null;
  @Column({ type: 'varchar', length: 120, nullable: true }) country!: string | null;
  @Column({ type: 'varchar', length: 20, nullable: true }) zipCode!: string | null;

  @Column({ type: 'text', nullable: true }) description!: string | null;

  @Column({ type: 'varchar', length: 1024, nullable: true }) leadImagePath!: string | null;

  @Column({ type: 'json', nullable: true }) customData!: Record<string, any> | null;

  @OneToOne(() => LeadKyc, (kyc) => kyc.lead, { cascade: true })
  @JoinColumn()
  kyc!: LeadKyc;

  @OneToMany(() => LeadDocument, (d) => d.lead, { cascade: true })
  documents!: LeadDocument[];
}