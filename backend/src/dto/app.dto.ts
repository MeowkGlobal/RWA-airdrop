import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateZkProofDto {
    @IsNotEmpty()
    @IsString()
    publicInput: string;
  
    @IsNotEmpty()
    @IsString()
    privateInput: string;
  }