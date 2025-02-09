import { Test, TestingModule } from '@nestjs/testing';
import { VideoProcessingController } from '@/transport/controller/video-processing.controller';
import { ProcessVideoPort } from '@/core/interactor/port/video-processing.port';
import { ProcessVideoResponseDto } from '@/transport/dto/video/video-response.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('VideoProcessingController', () => {
  let controller: VideoProcessingController;
  let processVideoUseCase: jest.Mocked<ProcessVideoPort>;

  beforeEach(async () => {
    processVideoUseCase = {
      execute: jest.fn(),
    } as jest.Mocked<ProcessVideoPort>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideoProcessingController],
      providers: [
        {
          provide: ProcessVideoPort,
          useValue: processVideoUseCase,
        },
      ],
    }).compile();

    controller = module.get<VideoProcessingController>(
      VideoProcessingController,
    );
  });

  it('should process video successfully', async () => {
    const videoBase64 = 'testBase64String';
    const mockedResponse = new ProcessVideoResponseDto(
      'Video processed successfully',
    );

    jest
      .spyOn(processVideoUseCase, 'execute')
      .mockResolvedValueOnce(mockedResponse);

    const response = await controller.process(videoBase64);

    expect(response).toBe(mockedResponse);
    expect(processVideoUseCase.execute).toHaveBeenCalledWith(videoBase64);
  });

  it('should throw BadRequestException when videoBase64 is missing', async () => {
    await expect(controller.process(null)).rejects.toThrow(BadRequestException);
  });

  it('should throw InternalServerErrorException when process fails', async () => {
    const videoBase64 = 'testBase64String';

    jest
      .spyOn(processVideoUseCase, 'execute')
      .mockRejectedValueOnce(new Error('Lambda error'));

    await expect(controller.process(videoBase64)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
