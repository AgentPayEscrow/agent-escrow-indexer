import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from './entities/agent.entity';
import { CreateAgentDto, DepositDto, PaymentDto, UpdateLimitsDto } from './dto/create-agent.dto';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
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
    
    const defaultLimits = {
      maxPerTransaction: 100_000_000,
      dailyLimit: 1_000_000_000,
      weeklyLimit: 5_000_000_000,
      monthlyLimit: 20_000_000_000,
    };
    
    const agent = this.agentRepository.create({
      agentId: nextAgentId,
      address: createAgentDto.address,
      name: createAgentDto.name,
      status: 'active',
      totalDeposited: 0,
      totalSpent: 0,
      remainingBalance: 0,
      spendingLimits: defaultLimits,
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
    const agent = await this.agentRepository.findOne({ where: { id } });
    
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    
    return agent;
  }

  async findByAddress(address: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({ where: { address } });
    
    if (!agent) {
      throw new NotFoundException(`Agent with address ${address} not found`);
    }
    
    return agent;
  }

  async updateLimits(id: number, updateLimitsDto: UpdateLimitsDto): Promise<Agent> {
    const agent = await this.findOne(id);
    
    agent.spendingLimits = {
      ...agent.spendingLimits,
      ...updateLimitsDto,
    };
    
    return this.agentRepository.save(agent);
  }

  async updateStatus(id: number, status: string): Promise<Agent> {
    const agent = await this.findOne(id);
    agent.status = status;
    return this.agentRepository.save(agent);
  }

  async getStats(id: number): Promise<any> {
    const agent = await this.findOne(id);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return {
      agentId: agent.agentId,
      name: agent.name,
      address: agent.address,
      status: agent.status,
      totalDeposited: agent.totalDeposited,
      totalSpent: agent.totalSpent,
      remainingBalance: agent.remainingBalance,
      limits: agent.spendingLimits,
      createdAt: agent.createdAt,
    };
  }
}