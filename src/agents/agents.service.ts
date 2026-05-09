import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan, LessThan } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { Transaction } from './entities/transaction.entity';
import { CreateAgentDto, DepositDto, PaymentDto } from './dto/create-agent.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);
  private readonly contractId: string;

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private configService: ConfigService,
  ) {
    this.contractId = this.configService.get('CONTRACT_ID', '');
  }

  async createAgent(createAgentDto: CreateAgentDto): Promise<Agent> {
    this.logger.log(`Creating agent: ${createAgentDto.name}`);
    
    const existingAgent = await this.agentRepository.findOne({
      where: { address: createAgentDto.address },
    });
    
    if (existingAgent) {
      throw new BadRequestException('Agent already exists');
    }
    
    const lastAgent = await this.agentRepository.find({
      order: { agentId: 'DESC' },
      take: 1,
    });
    
    const nextAgentId = lastAgent.length > 0 ? lastAgent[0].agentId + 1 : 1;
    
    const spendingLimits = {
      maxPerTransaction: 100_000_000,
      dailyLimit: 1_000_000_000,
      weeklyLimit: 5_000_000_000,
      monthlyLimit: 20_000_000_000,
      perRecipientLimit: 500_000_000,
    };
    
    const agent = this.agentRepository.create({
      agentId: nextAgentId,
      address: createAgentDto.address,
      name: createAgentDto.name,
      status: 'active',
      totalDeposited: 0,
      totalSpent: 0,
      remainingBalance: 0,
      spendingLimits,
    });
    
    return this.agentRepository.save(agent);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: Agent[]; total: number }> {
    const [data, total] = await this.agentRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    return { data, total };
  }

  async findOne(id: number): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['transactions'],
    });
    
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    return agent;
  }

  async findByAddress(address: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { address },
      relations: ['transactions'],
    });
    
    if (!agent) {
      throw new NotFoundException(`Agent with address ${address} not found`);
    }
    
    return agent;
  }

  async updateSpendingLimits(id: number, limits: any): Promise<Agent> {
    const agent = await this.findOne(id);
    
    agent.spendingLimits = {
      ...agent.spendingLimits,
      ...limits,
    };
    
    return this.agentRepository.save(agent);
  }

  async pauseAgent(id: number): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.status = 'paused';
    return this.agentRepository.save(agent);
  }

  async resumeAgent(id: number): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.status = 'active';
    return this.agentRepository.save(agent);
  }

  async recordTransaction(agentId: number, paymentDto: PaymentDto, txHash: string): Promise<Transaction> {
    const agent = await this.findOne(agentId);
    
    const lastTx = await this.transactionRepository.find({
      order: { transactionId: 'DESC' },
      take: 1,
    });
    
    const nextTxId = lastTx.length > 0 ? lastTx[0].transactionId + 1 : 1;
    
    const fee = Math.floor(paymentDto.amount * 0.001); // 0.1% fee
    const netAmount = paymentDto.amount - fee;
    
    const transaction = this.transactionRepository.create({
      transactionId: nextTxId,
      agentId: agent.agentId,
      fromAddress: agent.address,
      toAddress: paymentDto.toAddress,
      tokenAddress: paymentDto.tokenAddress,
      amount: paymentDto.amount,
      fee,
      netAmount,
      status: 'executed',
      memo: paymentDto.memo,
    });
    
    agent.totalSpent += paymentDto.amount;
    agent.remainingBalance -= paymentDto.amount;
    await this.agentRepository.save(agent);
    
    return this.transactionRepository.save(transaction);
  }

  async getTransactionHistory(agentId: number, page: number = 1, limit: number = 20): Promise<{ data: Transaction[]; total: number }> {
    const agent = await this.findOne(agentId);
    
    const [data, total] = await this.transactionRepository.findAndCount({
      where: { agentId: agent.agentId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    
    return { data, total };
  }

  async getSpendingStats(agentId: number): Promise<any> {
    const agent = await this.findOne(agentId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const todaySpent = await this.transactionRepository.sum('amount', {
      agentId: agent.agentId,
      createdAt: MoreThan(today),
    });
    
    const weekSpent = await this.transactionRepository.sum('amount', {
      agentId: agent.agentId,
      createdAt: MoreThan(thisWeek),
    });
    
    const monthSpent = await this.transactionRepository.sum('amount', {
      agentId: agent.agentId,
      createdAt: MoreThan(thisMonth),
    });
    
    return {
      agentId: agent.agentId,
      name: agent.name,
      totalDeposited: agent.totalDeposited,
      totalSpent: agent.totalSpent,
      remainingBalance: agent.remainingBalance,
      todaySpent: todaySpent || 0,
      weekSpent: weekSpent || 0,
      monthSpent: monthSpent || 0,
      limits: agent.spendingLimits,
    };
  }
}