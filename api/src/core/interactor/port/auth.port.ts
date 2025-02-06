import { GetAuthResponseDto } from '@/transport/dto/auth/auth-response.dto';

export abstract class AuthenticateUserPort {
  abstract execute(
    username: string,
    password: string,
  ): Promise<GetAuthResponseDto>;
}
