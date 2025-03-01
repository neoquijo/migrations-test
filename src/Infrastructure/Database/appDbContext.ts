import { Options } from 'sequelize';
import { DbContext } from './db-context';
import { config } from '../../config';
import logger from '../Services/Logger/logger';
import { initModels } from './initModels';

export class AppDbContext extends DbContext {
  constructor() {
    const dbOptions: Options = {
      database: config.database.database,
      username: config.database.username,
      password: config.database.password,
      host: config.database.host,
      port: config.database.port,
      dialect: config.database.dialect as any,
      logging: false
    };
    super(dbOptions, logger);
    initModels(this.sequelize);
  }

  public getSequelizeInstance() {
    return this.sequelize;
  }
}
