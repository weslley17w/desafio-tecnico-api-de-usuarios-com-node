import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './database/database.js';
import { connectRedis } from './shared/db/redis.js';

const serverPort = env.SERVER_PORT;

(async () => {
  try {
    await connectDatabase();
    await connectRedis();
    app.listen(serverPort);
    console.log(`Server is running on port ${serverPort}`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
})();
