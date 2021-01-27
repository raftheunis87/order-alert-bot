import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Telegram from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private telegram: Telegram;
  private chatId: string;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly configService: ConfigService) {
    this.telegram = new Telegram(
      this.configService.get<string>('telegram.botToken'),
      { polling: true },
    );
    this.chatId = this.configService.get<string>('telegram.chatId');
  }

  async send(message: string) {
    const result = await this.retry(
      () => this.telegram.sendMessage(this.chatId, message),
      {
        maxTries: 12,
        timeout: 10000,
      },
    );

    if (!result) {
      this.logger.error('Failed to send Telegram message.');
    }
  }

  // HELPERS

  async sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  async retry(fnc, options) {
    // eslint-disable-next-line prefer-const
    let { maxTries, timeout, validateFnc, initialTimeout } = Object.assign(
      {
        maxTries: 3,
        timeout: 10000,
        initialTimeout: 0,
        validateFnc: null,
        failFnc: null,
      },
      options || {},
    );

    if (maxTries <= 0) {
      if (typeof options.failFnc === 'function') {
        options.failFnc();
      }
      return null;
    }

    if (typeof initialTimeout === 'number' && initialTimeout > 0) {
      await this.sleep(initialTimeout);
    }

    try {
      maxTries--;
      const result = await fnc(maxTries);
      let validationResult =
        typeof validateFnc === 'function'
          ? validateFnc(result, maxTries)
          : true;

      if (validationResult instanceof Promise) {
        validationResult = await validationResult;
      }

      if (validationResult) {
        return typeof validationResult !== 'boolean'
          ? validationResult
          : result;
      } else {
        await this.sleep(timeout);
        return this.retry(fnc, { maxTries, timeout, validateFnc });
      }
    } catch (err) {
      console.log(['api', 'retry'], err);
      await this.sleep(timeout);
      return this.retry(fnc, { maxTries, timeout, validateFnc });
    }
  }
}
