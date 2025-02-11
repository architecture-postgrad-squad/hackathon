import { AuthenticateUserUseCase } from '@/core/interactor/use-case/auth.use-case';
import { AuthenticateUserPort } from '@/core/interactor/port/auth.port';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { BadRequestException } from '@/core/exceptions/custom-exceptions/bad-request.exception';
import { NotFoundException } from '@/core/exceptions/custom-exceptions/not-found.exception';
import { UnauthorizedException } from '@/core/exceptions/custom-exceptions/unauthorized.exception';
import { Logger } from '@nestjs/common';

describe('AuthenticateUserUseCase', () => {
  let useCase: AuthenticateUserPort;
  let mockLambdaClient: jest.Mocked<LambdaClientPort>;

  beforeEach(() => {
    mockLambdaClient = {
      invokeAuthLambda: jest.fn(),
      invokeVideoLambda: jest.fn(),
      getLambdaClient: jest.fn(),
    } as jest.Mocked<LambdaClientPort>;

    useCase = new AuthenticateUserUseCase(mockLambdaClient);
  });

  it('should authenticate user successfully', async () => {
    const email = 'test@example.com';
    const password = 'securePassword';
    const mockLambdaResponse = {
      StatusCode: 200,
      Payload: new Uint8Array(Buffer.from(JSON.stringify('mockJwtToken'))), // ✅ Corrected Payload format
    };

    jest
      .spyOn(mockLambdaClient, 'invokeAuthLambda')
      .mockResolvedValueOnce(mockLambdaResponse as never);

    const response = await useCase.execute(email, password);

    expect(response).toEqual({ token: 'mockJwtToken' }); // ✅ FIXED HERE

    expect(mockLambdaClient.invokeAuthLambda).toHaveBeenCalledWith(
      JSON.stringify({ email, password }),
    );
  });

  it('should throw NotFoundException when user is not found', async () => {
    const email = 'notfound@example.com';
    const password = 'password123';

    jest
      .spyOn(mockLambdaClient, 'invokeAuthLambda')
      .mockRejectedValueOnce(new Error('User not found'));

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(useCase.execute(email, password)).rejects.toThrow(
      NotFoundException,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      'Error authenticating user',
      expect.any(String),
    );
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    const email = 'test@example.com';
    const password = 'wrongPassword';

    jest
      .spyOn(mockLambdaClient, 'invokeAuthLambda')
      .mockRejectedValueOnce(new Error('Invalid credentials'));

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(useCase.execute(email, password)).rejects.toThrow(
      UnauthorizedException,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      'Error authenticating user',
      expect.any(String),
    );
  });

  it('should throw BadRequestException on general errors', async () => {
    const email = 'test@example.com';
    const password = 'securePassword';

    jest
      .spyOn(mockLambdaClient, 'invokeAuthLambda')
      .mockRejectedValueOnce(new Error('Some other error'));

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(useCase.execute(email, password)).rejects.toThrow(
      BadRequestException,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      'Error authenticating user',
      expect.any(String),
    );
  });
});
