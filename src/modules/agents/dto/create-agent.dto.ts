import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'GABC123...', description: 'Stellar wallet address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Trading Bot', description: 'Agent name' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ApiProperty({ required: false, description: 'Metadata URI' })
  @IsString()
  @IsOptional()
  metadataUri?: string;
}

export class DepositDto {
  @ApiProperty({ example: 1, description: 'Agent ID' })
  @IsNotEmpty()
  agentId: number;

  @ApiProperty({ example: 'GABC123...', description: 'Token address' })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ example: 1000000, description: 'Amount to deposit' })
  @IsNotEmpty()
  amount: number;
}

export class PaymentDto {
  @ApiProperty({ example: 1, description: 'Agent ID' })
  @IsNotEmpty()
  agentId: number;

  @ApiProperty({ example: 'GXYZ789...', description: 'Recipient address' })
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: 'GABC123...', description: 'Token address' })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ example: 100000, description: 'Payment amount' })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ required: false, description: 'Payment memo' })
  @IsString()
  @IsOptional()
  memo?: string;
}

export class UpdateLimitsDto {
  @ApiProperty({ required: false, description: 'Max per transaction' })
  @IsOptional()
  maxPerTransaction?: number;

  @ApiProperty({ required: false, description: 'Daily limit' })
  @IsOptional()
  dailyLimit?: number;

  @ApiProperty({ required: false, description: 'Weekly limit' })
  @IsOptional()
  weeklyLimit?: number;

  @ApiProperty({ required: false, description: 'Monthly limit' })
  @IsOptional()
  monthlyLimit?: number;
}