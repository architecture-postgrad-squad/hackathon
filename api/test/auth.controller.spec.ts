import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { AuthenticationController } from '@/transport/controller/auth.controller';
import { GetAuthResponseDto } from '@/transport/dto/auth/auth-response.dto';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let userAuthUseCase: jest.Mocked<AuthenticateUserPort>;

  beforeEach(async () => {
    userAuthUseCase = {
      execute: jest.fn(),
    } as jest.Mocked<AuthenticateUserPort>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticateUserPort,
          useValue: userAuthUseCase,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should authenticate user credentials', async () => {
    const credentialsQueryValue = ['testus', '123'];

    const mockedResponse: GetAuthResponseDto = {
      token: '7489d2e8-3a74-488a-97ea-47a162b29a7e',
    };

    jest
      .spyOn(userAuthUseCase, 'execute')
      .mockResolvedValueOnce(mockedResponse);

    const response: GetAuthResponseDto = await controller.authenticateUser(
      credentialsQueryValue[0],
      credentialsQueryValue[1],
    );

    expect(response).toBe(mockedResponse);
    expect(userAuthUseCase.execute).toHaveBeenCalledWith(
      credentialsQueryValue[0],
      credentialsQueryValue[1],
    );
  });
});
