import { Module } from '@nestjs/common';
import { ProcessVideoPort } from '@/core/interactor/port/video-processing.port';
import { ProcessVideoUseCase } from '@/core/interactor/use-case/video-processing.use-case';
import { LambdaClientPort } from '@/datasource/aws-lambda/port/lambda.port';
import { LambdaClientAdapter } from '@/datasource/aws-lambda/adapter/lambda-client.adapter';
import { VideoProcessingController } from '@/transport/controller/video-processing.controller';

@Module({
  imports: [],
  controllers: [VideoProcessingController],
  providers: [
    {
      provide: ProcessVideoPort,
      useFactory: (lambdaClientPort: LambdaClientPort) => {
        return new ProcessVideoUseCase(lambdaClientPort);
      },
      inject: [LambdaClientPort],
    },
    {
      provide: LambdaClientPort,
      useClass: LambdaClientAdapter,
    },
  ],
})
export class VideoProcessingModule {}
