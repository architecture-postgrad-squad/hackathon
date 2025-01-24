import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/auth-lambda.port';
import { GetAuthResponseDto } from '@/transport/dto/auth/auth-response.dto';

export class AuthenticateUserUseCase implements AuthenticateUserPort {
  constructor(private readonly lambdaClientPort: LambdaClientPort) {}

  async execute(email: string, password: string): Promise<GetAuthResponseDto> {
    try {
      const response = await this.lambdaClientPort.invokeAuthLambda(
        JSON.stringify({
          email,
          password,
        }),
      );
      return this.generateResponse(new Uint8Array(response.Payload));
    } catch (error) {
      //TODO: use logger
      //TODO: implement custoaccess_tokenm exception
      //TODO: throw 401 exception
      console.log(error);
    }
  }

  private generateResponse(payload: Uint8Array): GetAuthResponseDto {
    return {
      token: String.fromCharCode(...payload),
    };
  }
}
