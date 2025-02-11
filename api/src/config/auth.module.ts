import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { AuthenticateUserUseCase } from '@/core/interactor/use-case/auth.use-case';
import { LambdaClientAdapter } from '@/datasource/aws-lambda/adapter/lambda-client.adapter';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { AuthenticationController } from '@/transport/controller/auth.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: AuthenticateUserPort,
      useFactory: (lambdaClientPort: LambdaClientPort) => {
        return new AuthenticateUserUseCase(lambdaClientPort);
      },
      inject: [LambdaClientPort],
    },
    {
      provide: LambdaClientPort,
      useClass: LambdaClientAdapter,
    },
  ],
})
export class AuthenticationModule {}
