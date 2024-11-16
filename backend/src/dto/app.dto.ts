import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateZkProofDto {
    @IsNotEmpty()
    @IsString()
    address: string;
  
    @IsNotEmpty()
    stockQuantity: string;

    @IsNotEmpty()
    stockBuyTimestamp: string;
  }