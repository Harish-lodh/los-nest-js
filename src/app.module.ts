import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OcrModule } from './ocr/ocr.module';
import { KycModule } from './kyc/kyc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './lead/lead.module';

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   envFilePath: ['.env'],
    // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Harish@55',
      database: 'postgres', // Updated to match the existing database name
      autoLoadEntities: true,
      logging: true, // Enable logging to debug SQL queries
      synchronize: false,
    }),
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