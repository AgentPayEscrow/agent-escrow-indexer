import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Execute a payment' })
  async pay(@Body() body: { agentId: number; toAddress: string; tokenAddress: string; amount: number; memo?: string }) {
    return this.paymentsService.executePayment(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  async getTransaction(@Param('id', ParseIntPipe) id: number) {
    return this.paymentsService.getTransaction(id);
  }

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'Get all transactions for an agent' })
  async getAgentTransactions(@Param('agentId', ParseIntPipe) agentId: number) {
    return this.paymentsService.getAgentTransactions(agentId);
  }
}