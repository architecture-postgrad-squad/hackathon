import { AuthenticationModule } from '@/config/auth.module';
import { VideoProcessingModule } from '@/config/video-processing.module';
import { AppController } from '@/transport/controller/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthenticationModule, VideoProcessingModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
