import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../agents/entities/agent.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private transactions: any[] = [];
  private nextId = 1;

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async executePayment(data: { agentId: number; toAddress: string; tokenAddress: string; amount: number; memo?: string }) {
    this.logger.log(`Executing payment for agent ${data.agentId}`);
    
    const agent = await this.agentRepository.findOne({ where: { id: data.agentId } });
    if (!agent) {
      throw new NotFoundException(`Agent ${data.agentId} not found`);
    }
    
    const fee = Math.floor(data.amount * 0.001);
    const netAmount = data.amount - fee;
    
    const transaction = {
      id: this.nextId++,
      agentId: data.agentId,
      fromAddress: agent.address,
      toAddress: data.toAddress,
      tokenAddress: data.tokenAddress,
      amount: data.amount,
      fee,
      netAmount,
      status: 'executed',
      memo: data.memo,
      createdAt: new Date(),
    };
    
    this.transactions.push(transaction);
    
    agent.totalSpent += data.amount;
    agent.remainingBalance -= data.amount;
    await this.agentRepository.save(agent);
    
    return transaction;
  }

  async getTransaction(id: number) {
    const transaction = this.transactions.find(t => t.id === id);
    if (!transaction) {
      throw new NotFoundException(`Transaction ${id} not found`);
    }
    return transaction;
  }

  async getAgentTransactions(agentId: number) {
    return this.transactions.filter(t => t.agentId === agentId);
  }
}