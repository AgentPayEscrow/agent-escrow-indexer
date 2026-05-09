import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto, DepositDto, PaymentDto } from './dto/create-agent.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  async create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.createAgent(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.agentsService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  async findOne(@Param('id') id: string) {
    return this.agentsService.findOne(+id);
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Get agent by address' })
  async findByAddress(@Param('address') address: string) {
    return this.agentsService.findByAddress(address);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause agent' })
  async pause(@Param('id') id: string) {
    return this.agentsService.pauseAgent(+id);
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume agent' })
  async resume(@Param('id') id: string) {
    return this.agentsService.resumeAgent(+id);
  }

  @Patch(':id/limits')
  @ApiOperation({ summary: 'Update spending limits' })
  async updateLimits(@Param('id') id: string, @Body() limits: any) {
    return this.agentsService.updateSpendingLimits(+id, limits);
  }

  @Post('payment')
  @ApiOperation({ summary: 'Execute payment' })
  async pay(@Body() paymentDto: PaymentDto) {
    const txHash = `0x${Math.random().toString(36).substring(2)}`; // Mock tx hash
    return this.agentsService.recordTransaction(paymentDto.agentId, paymentDto, txHash);
  }

  @Get(':id/transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  async getTransactions(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.agentsService.getTransactionHistory(+id, +page, +limit);
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get spending statistics' })
  async getStats(@Param('id') id: string) {
    return this.agentsService.getSpendingStats(+id);
  }
}