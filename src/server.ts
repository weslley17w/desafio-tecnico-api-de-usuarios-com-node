import app from './app.js';

const serverPort = process.env.SERVER_PORT || 3000;

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
