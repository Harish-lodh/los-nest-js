import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { ConfigModule } from '@nestjs/config'
import { KycModule } from './kyc/kyc.module';
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),OcrModule, KycModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
