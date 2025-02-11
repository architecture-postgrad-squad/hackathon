import { ProcessVideoUseCase } from '@/core/interactor/use-case/video-processing.use-case';
import { ProcessVideoPort } from '@/core/interactor/port/video-processing.port';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { ProcessVideoResponseDto } from '@/transport/dto/video/video-response.dto';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { Logger } from '@nestjs/common';

describe('ProcessVideoUseCase', () => {
  let useCase: ProcessVideoPort;
  let mockLambdaClient: jest.Mocked<LambdaClientPort>;

  beforeEach(() => {
    mockLambdaClient = {
      invokeAuthLambda: jest.fn(), // ✅ Mock required method
      invokeVideoLambda: jest.fn(), // ✅ Required for this test
      getLambdaClient: jest.fn(), // ✅ Mock required method
    } as jest.Mocked<LambdaClientPort>;

    useCase = new ProcessVideoUseCase(mockLambdaClient);
  });

  it('should process video successfully', async () => {
    const videoBase64 = 'testBase64String';
    const mockLambdaResponse = {
      StatusCode: 200,
      Payload: new Uint8Array(
        Buffer.from(JSON.stringify('Video processed successfully')),
      ), // ✅ Proper JSON response
    };

    jest
      .spyOn(mockLambdaClient, 'invokeVideoLambda')
      .mockResolvedValueOnce(mockLambdaResponse as never);

    const response = await useCase.execute(videoBase64);

    expect(response).toEqual(
      new ProcessVideoResponseDto('Video processed successfully'),
    ); // ✅ No extra quotes

    expect(mockLambdaClient.invokeVideoLambda).toHaveBeenCalledWith(
      JSON.stringify({ video_base64: videoBase64 }),
    );
  });

  it('should log error and throw InternalServerErrorException when Lambda fails', async () => {
    const videoBase64 = 'testBase64String';

    jest
      .spyOn(mockLambdaClient, 'invokeVideoLambda')
      .mockRejectedValueOnce(new Error('Lambda Error'));

    const loggerSpy = jest.spyOn(Logger.prototype, 'error');

    await expect(useCase.execute(videoBase64)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(loggerSpy).toHaveBeenCalledWith(
      'Error processing video',
      expect.any(String),
    );
  });
});
