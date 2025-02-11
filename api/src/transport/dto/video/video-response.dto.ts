import { ApiProperty } from '@nestjs/swagger';

export class ProcessVideoResponseDto {
  @ApiProperty({ description: 'Message confirming video processing' })
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
