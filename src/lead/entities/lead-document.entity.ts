// src/leads/entities/lead-document.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Lead } from './lead.entity';

@Entity('lead_documents')
export class LeadDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

@Column({ type: 'varchar', length: 64 })
type!: string;

@Column({ type: 'varchar', length: 255 })
originalName!: string;

@Column({ type: 'varchar', length: 1024 })
path!: string;

  @ManyToOne(() => Lead, (lead) => lead.documents)
  lead: Lead;
}
