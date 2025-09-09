import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { KycModule } from './kyc/kyc.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './lead/lead.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ load .env automatically
    MongooseModule.forRoot(process.env.MONGO_URL!),
    OcrModule,
    KycModule,
     UsersModule,
     AuthModule,
     LeadsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
