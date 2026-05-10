import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  agentId: number;

  @Column()
  address: string;

  @Column()
  name: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ type: 'bigint', default: 0 })
  totalDeposited: number;

  @Column({ type: 'bigint', default: 0 })
  totalSpent: number;

  @Column({ type: 'bigint', default: 0 })
  remainingBalance: number;

  @Column({ type: 'jsonb', nullable: true })
  spendingLimits: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}