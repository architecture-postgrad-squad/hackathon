import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { GetAuthResponseDto } from '@/transport/dto/auth/auth-response.dto';
import { Logger } from '@nestjs/common';
import { BadRequestException } from '@/core/exceptions/custom-exceptions/bad-request.exception';
import { NotFoundException } from '@/core/exceptions/custom-exceptions/not-found.exception';
import { UnauthorizedException } from '@/core/exceptions/custom-exceptions/unauthorized.exception';

export class AuthenticateUserUseCase implements AuthenticateUserPort {
  private readonly logger = new Logger(AuthenticateUserUseCase.name);
  
  constructor(private readonly lambdaClientPort: LambdaClientPort) {}

  async execute(email: string, password: string): Promise<GetAuthResponseDto> {
    try {
      const response = await this.lambdaClientPort.invokeAuthLambda(
        JSON.stringify({ email, password }),
      );

      return this.generateResponse(new Uint8Array(response.Payload));
    } catch (error) {
      this.logger.error('Error authenticating user', error.stack);

      if (error.message.includes('User not found')) {
        throw new NotFoundException({ description: 'User not found' });
      }

      if (error.message.includes('Invalid credentials')) {
        throw new UnauthorizedException({ description: 'Invalid credentials' });
      }

      throw new BadRequestException({ description: 'Bad Request' });
    }
  }

  private generateResponse(payload: Uint8Array): GetAuthResponseDto {
    const rawString = String.fromCharCode(...payload);
    const parsedToken = rawString.startsWith('"')
      ? JSON.parse(rawString)
      : rawString;
    return { token: parsedToken };

  }
}
