import { registerAs } from '@nestjs/config';

export default registerAs('ftx', () => ({
  accounts: JSON.parse(process.env.FTX_ACCOUNTS) || [],
}));
