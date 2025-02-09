import { ProcessVideoPort } from '@/core/interactor/port/video-processing.port';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { ProcessVideoResponseDto } from '@/transport/dto/video/video-response.dto';
import { InternalServerErrorException } from '@/core/exceptions/custom-exceptions/internal-server-error.exception';
import { Logger } from '@nestjs/common';

export class ProcessVideoUseCase implements ProcessVideoPort {
  private readonly logger = new Logger(ProcessVideoUseCase.name);

  constructor(private readonly lambdaClientPort: LambdaClientPort) {}

  async execute(videoBase64: string): Promise<ProcessVideoResponseDto> {
    try {
      const response = await this.lambdaClientPort.invokeVideoLambda(
        JSON.stringify({
          video_base64: videoBase64,
        }),
      );

      return this.generateResponse(new Uint8Array(response.Payload));
    } catch (error) {
      this.logger.error('Error processing video', error.stack);
      throw new InternalServerErrorException({
        description: 'Failed to process video.',
      });
    }
  }

  private generateResponse(payload: Uint8Array): ProcessVideoResponseDto {
    const rawString = String.fromCharCode(...payload);
    const parsedMessage = rawString.startsWith('"')
      ? JSON.parse(rawString)
      : rawString;
    return new ProcessVideoResponseDto(parsedMessage);
  }
}
