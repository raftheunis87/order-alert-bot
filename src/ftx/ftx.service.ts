import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FTXWS from 'ftx-api-ws';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class FtxService {
  private readonly logger = new Logger(FtxService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly telegramService: TelegramService,
  ) {
    this.startWebsocket();
  }

  startWebsocket() {
    const accounts = this.configService.get('ftx.accounts');

    accounts.forEach(async (account) => {
      const ftx = new FTXWS(account);
      await ftx.connect();
      ftx.subscribe('orders');
      ftx.on('orders', (order) => {
        if (this.isUnfilledOrder(order)) return;
        this.send(this.buildMessage(account, order));
      });
    });
  }

  async send(message) {
    return this.telegramService.send(message);
  }

  // HELPERS

  buildMessage(account, data) {
    const accountName = account.subaccount
      ? `Subaccount ${account.subaccount}`
      : 'Main Account';

    if (this.isClosedMarketOrder(data)) {
      const { filledSize, avgFillPrice, reduceOnly } = data;

      // If reduce only equals true, we assume it's a stop market. Sadly no other way to differentiate afaik.
      if (reduceOnly === true) {
        return `${accountName}\nFilled stop market order.\n${filledSize} @ ${avgFillPrice}`;
      } else {
        return `${accountName}\nFilled market order.\n${filledSize} @ ${avgFillPrice}`;
      }
    }

    if (data.type === 'limit') {
      const { remainingSize, filledSize, size, reduceOnly, price } = data;
      const fillStateStr = remainingSize > 0 ? 'Partially filled' : 'Filled';

      // If reduce only equals true, we assume it's a stop limit. Sadly no other way to differentiate afaik.
      if (reduceOnly === true) {
        return `${accountName}\n${fillStateStr} stop limit order.\n${filledSize} of ${size} @ ${price}`;
      } else {
        return `${accountName}\n${fillStateStr} limit order.\n${filledSize} of ${size} @ ${price}`;
      }
    }
  }

  isUnfilledOrder(order) {
    return order.filledSize === 0;
  }

  isClosedMarketOrder(order) {
    return order.type === 'market' && order.status === 'closed';
  }
}
