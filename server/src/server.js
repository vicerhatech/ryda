import 'dotenv/config';
import http from 'http';
import app from './app.js';
import connectDatabase from './shared/config/database.js';
import { initializeSocket } from './shared/sockets/socketServer.js';

const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

initializeSocket(server);

async function startServer() {
  if (process.env.MONGODB_URI) {
    await connectDatabase();
  } else {
    console.warn('MONGODB_URI is not configured; starting without a database connection.');
  }

  server.listen(port, () => {
    console.log(`Ryda API listening on port ${port}`);
  });
}

startServer().catch((error) => {
  console.error('Unable to start Ryda API:', error);
  process.exit(1);
});
