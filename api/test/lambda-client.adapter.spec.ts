import { LambdaClientAdapter } from '@/datasource/aws-lambda/adapter/lambda-client.adapter';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { Logger } from '@nestjs/common';

jest.mock('@aws-sdk/client-lambda');

describe('LambdaClientAdapter', () => {
  let adapter: LambdaClientPort;
  let mockLambdaClient: jest.Mocked<LambdaClient>;

  beforeEach(() => {
    process.env.AWS_AUTH_LAMBDA_FUNC_NAME = 'mockAuthLambda';
    process.env.AWS_VIDEO_LAMBDA_FUNC_NAME = 'mockVideoLambda';

    mockLambdaClient = new LambdaClient({}) as jest.Mocked<LambdaClient>;

    jest.spyOn(mockLambdaClient, 'send').mockResolvedValue({
      StatusCode: 200,
      Payload: new Uint8Array(
        Buffer.from(JSON.stringify({ statusCode: 200, body: 'Success' })),
      ),
      $metadata: { httpStatusCode: 200 },
    } as never);

    (LambdaClient as jest.Mock).mockImplementation(() => mockLambdaClient);

    adapter = new LambdaClientAdapter();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should invoke auth Lambda successfully', async () => {
    const payload = JSON.stringify({
      email: 'test@example.com',
      password: '123456',
    });

    const response = await adapter.invokeAuthLambda(payload);

    expect(response.StatusCode).toBe(200);
    expect(mockLambdaClient.send).toHaveBeenCalledWith(
      expect.any(InvokeCommand),
    );
  });

  it('should invoke video Lambda successfully', async () => {
    const payload = JSON.stringify({ video_base64: 'someBase64String' });

    const response = await adapter.invokeVideoLambda(payload);

    expect(response.StatusCode).toBe(200);
    expect(mockLambdaClient.send).toHaveBeenCalledWith(
      expect.any(InvokeCommand),
    );
  });

  it('should log and throw an error when Lambda invocation fails', async () => {
    jest
      .spyOn(mockLambdaClient, 'send')
      .mockRejectedValue(new Error('AWS Lambda Error') as never); // ✅ Fix

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(adapter.invokeAuthLambda('{}')).rejects.toThrow(
      'AWS Lambda Error',
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error invoking Lambda'),
      expect.any(String),
    );
  });

  it('should log and throw an error when Lambda client creation fails', async () => {
    (LambdaClient as jest.Mock).mockImplementation(() => {
      throw new Error('AWS Client Error');
    });

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(adapter.getLambdaClient()).rejects.toThrow('AWS Client Error');

    expect(loggerSpy).toHaveBeenCalledWith(
      'Error creating Lambda client',
      expect.any(String),
    );
  });
});
