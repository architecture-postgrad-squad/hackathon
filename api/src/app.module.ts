import { AuthenticationModule } from '@/config/auth.module';
import { AppController } from '@/transport/controller/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthenticationModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
