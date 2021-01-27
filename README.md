<p align="center">
  <a href="#about">About</a>
  •
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#images">Images</a>
  •
  <a href="#how-can-i-help">Help</a>
</p>

## About
The **Order Alert Bot** listens to [FTX]( https://ftx.com) orders via [websockets](https://docs.ftx.com/#websocket-api) using [NestJS](https://nestjs.com/).
For each order you will receive a notification in [Telegram](https://telegram.org/).

## Installation
> ⚠️ Best to run the bot on a VPS. I can recommend [Hetzner](https://www.hetzner.com/cloud).
1. Install [NodeJS](https://nodejs.org/en/download/)
1. Clone this repository `git clone https://github.com/raftheunis87/order-alert-bot.git`
1. Install all requirements `npm install`
1. Rename `.env.example` to `.env` and replace the <> placeholders with the correct values:
    - `APP_PORT` is the port on which you want the application to run
    - `TELEGRAM_BOT_TOKEN` is the token you receive after creating a bot with the BotFather
    - `TELEGRAM_CHAT_ID` is the id of the telegram group or channel in which the bot will give the order alerts
    - `FTX_ACCOUNTS` is an array of objects in which you can add all your FTX subaccounts. Each object needs the following keys:
      - key: the apiKey from FTX
      - secret: the secret from FTX
      - subaccount: the name of the subaccount
1. Run the bot `npm run build && npm run start:prod`