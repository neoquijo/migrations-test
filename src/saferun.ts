import { spawn } from 'child_process';
import path from 'path';
import logger from './Infrastructure/Services/Logger/logger';

function safeRunMain() {
  console.log(path.join(__dirname, 'dist', 'server.js'))
  const app = spawn('ts-node', [path.join(__dirname, 'dist', 'server.js')], {
    stdio: 'inherit'
  });

  app.on('close', (code) => {
    logger.info(`Child process exited with code ${code}`);
    logger.info(path.join(__dirname, 'dist', 'server.js'))
    if (code !== 0) {
      logger.info('Restarting application...');
      safeRunMain();
    }
  });
}

try {
  safeRunMain();
} catch (error) {
  logger.error('Error in wrapper script:', error);
  process.exit(1);
}
