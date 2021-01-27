import { Module } from '@nestjs/common';
import { TelegramModule } from 'src/telegram/telegram.module';
import { FtxService } from './ftx.service';

@Module({
  imports: [TelegramModule],
  providers: [FtxService],
})
export class FtxModule {}
