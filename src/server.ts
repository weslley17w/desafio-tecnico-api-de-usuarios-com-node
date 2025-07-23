import app from './app.js';
import { env } from './config/env.js';
import { db } from './database/database.js';

const serverPort = env.SERVER_PORT;

(async () => {
  try {
    await db.authenticate();
    app.listen(serverPort);
    console.log(`Server is running on port ${serverPort}`);
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
})();
