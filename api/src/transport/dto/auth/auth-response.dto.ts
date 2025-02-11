import { ApiProperty } from '@nestjs/swagger';

export class GetAuthResponseDto {
  @ApiProperty({ description: 'JWT Token for user credentials' })
  token: string;
}
