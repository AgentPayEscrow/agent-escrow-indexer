import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Agent } from './agent.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: number;

  @Column()
  agentId: number;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;

  @Column()
  tokenAddress: string;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ type: 'bigint', default: 0 })
  fee: number;

  @Column({ type: 'bigint', default: 0 })
  netAmount: number;

  @Column({ default: 'executed' })
  status: string;

  @Column({ nullable: true })
  memo: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Agent)
  @JoinColumn({ name: 'agentId' })
  agent: Agent;
}