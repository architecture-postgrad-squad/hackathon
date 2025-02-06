import { ProcessVideoResponseDto } from '@/transport/dto/video/video-response.dto';

export abstract class ProcessVideoPort {
  abstract execute(videoBase64: string): Promise<ProcessVideoResponseDto>;
}
