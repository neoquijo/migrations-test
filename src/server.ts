import { createApp } from './app';
import { config } from './config';
import { AppDbContext } from './Infrastructure/Database/appDbContext';
import logger from './Infrastructure/Services/Logger/logger';
import { runMigrations } from './migrate';

const startServer = async () => {
  try {
    const dbContext = new AppDbContext();
    await dbContext.executeQuery(async () => {
      return dbContext['sequelize'].authenticate();

    });
    await runMigrations();
    const app = createApp(dbContext);
    app.listen(config.server.port, () => {
      logger.info(`Server started on port ${config.server.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
