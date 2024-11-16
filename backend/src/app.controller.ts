import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { GenerateZkProofDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/v1/generateProcessZkProof')
  generateProcessZkProof(@Body() generateZkProofDto: GenerateZkProofDto) {
  try {
    //hit the script 
    //if airdropped return success
    //else return proof failed or price did not hit the threshold.
  } catch(error){
    throw new HttpException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: error.message,
      error: 'Bad Request'
      }, HttpStatus.BAD_REQUEST);
    }
  }
}
