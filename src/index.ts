import { environment } from './config/environment';
import app from './server/app';

async function startServer() {
  try {
    await app.listen({
      host: '0.0.0.0',
      port: environment.PORT,
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

void startServer();
