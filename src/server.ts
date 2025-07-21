import app from './app.js';
import { db } from './database/database.js';

const serverPort = process.env.SERVER_PORT || 3000;

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
