import { Controller, Get, Post, Body, Param, Query, Patch, ParseIntPipe } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto, DepositDto, PaymentDto, UpdateLimitsDto } from './dto/create-agent.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('agents')
@Controller('agents')
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new agent' })
  @ApiResponse({ status: 201, description: 'Agent created successfully' })
  async create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all agents' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.agentsService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get agent by ID' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.findOne(id);
  }

  @Get('address/:address')
  @ApiOperation({ summary: 'Get agent by address' })
  async findByAddress(@Param('address') address: string) {
    return this.agentsService.findByAddress(address);
  }

  @Patch(':id/limits')
  @ApiOperation({ summary: 'Update agent spending limits' })
  async updateLimits(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLimitsDto: UpdateLimitsDto,
  ) {
    return this.agentsService.updateLimits(id, updateLimitsDto);
  }

  @Patch(':id/pause')
  @ApiOperation({ summary: 'Pause agent' })
  async pause(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.updateStatus(id, 'paused');
  }

  @Patch(':id/resume')
  @ApiOperation({ summary: 'Resume agent' })
  async resume(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.updateStatus(id, 'active');
  }

  @Get(':id/stats')
  @ApiOperation({ summary: 'Get agent statistics' })
  async getStats(@Param('id', ParseIntPipe) id: number) {
    return this.agentsService.getStats(id);
  }
}