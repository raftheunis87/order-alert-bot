import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FtxModule } from './ftx/ftx.module';
import { TelegramModule } from './telegram/telegram.module';
import { validationSchema } from './config/schema';
import * as Joi from '@hapi/joi';
import app from './config/app.config';
import telegram from './config/telegram.config';
import ftx from './config/ftx.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [app, telegram, ftx],
      validationOptions: {
        allowUnknowns: false,
      },
      validationSchema: Joi.object(validationSchema),
    }),
    FtxModule,
    TelegramModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
