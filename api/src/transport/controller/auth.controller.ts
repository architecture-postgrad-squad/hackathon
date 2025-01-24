import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { GetAuthResponseDto } from '@/transport/dto/auth/auth-response.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly userAuthUseCase: AuthenticateUserPort) {}

  @Get('/auth')
  @ApiQuery({ name: 'email' })
  @ApiQuery({ name: 'password' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: () => GetAuthResponseDto,
  })
  async authenticateUser(
    @Query('email') email: string,
    @Query('password') password: string,
  ): Promise<GetAuthResponseDto> {
    return await this.userAuthUseCase.execute(email, password);
  }
}
