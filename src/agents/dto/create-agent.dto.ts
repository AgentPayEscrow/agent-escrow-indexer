import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgentDto {
  @ApiProperty({ example: 'GABC...', description: 'Agent wallet address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'Trading Bot', description: 'Agent name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, description: 'Metadata URI' })
  @IsString()
  @IsOptional()
  metadataUri?: string;
}

export class DepositDto {
  @ApiProperty({ example: 1, description: 'Agent ID' })
  @IsNumber()
  @Min(1)
  agentId: number;

  @ApiProperty({ example: 'GABC...', description: 'Token address' })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ example: 1000000, description: 'Amount to deposit' })
  @IsNumber()
  @Min(1)
  amount: number;
}

export class PaymentDto {
  @ApiProperty({ example: 1, description: 'Agent ID' })
  @IsNumber()
  @Min(1)
  agentId: number;

  @ApiProperty({ example: 'GXYZ...', description: 'Recipient address' })
  @IsString()
  @IsNotEmpty()
  toAddress: string;

  @ApiProperty({ example: 'GABC...', description: 'Token address' })
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty({ example: 100000, description: 'Payment amount' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ required: false, description: 'Payment memo' })
  @IsString()
  @IsOptional()
  memo?: string;
}