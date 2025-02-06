import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
} from '@nestjs/common';
import { ProcessVideoPort } from '@/core/interactor/port/video-processing.port';
import { ProcessVideoResponseDto } from '@/transport/dto/video/video-response.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Video Processing')
@Controller('video')
export class VideoProcessingController {
  constructor(private readonly processVideoUseCase: ProcessVideoPort) {}

  @Post('process')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        videoBase64: {
          type: 'string',
          description: 'Base64-encoded video file',
        },
      },
      required: ['videoBase64'],
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ProcessVideoResponseDto,
    description: 'Successfully processed the video',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'No video provided',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Failed to process video',
  })
  async process(
    @Body('videoBase64') videoBase64: string,
  ): Promise<ProcessVideoResponseDto> {
    if (!videoBase64) {
      throw new BadRequestException('No video provided');
    }

    try {
      return await this.processVideoUseCase.execute(videoBase64);
    } catch (error) {
      throw new InternalServerErrorException('Failed to process video');
    }
  }
}
