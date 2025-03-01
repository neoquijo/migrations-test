import { Umzug, SequelizeStorage } from 'umzug';
import { AppDbContext } from './Infrastructure/Database/appDbContext';

const dbContext = new AppDbContext();
const sequelizeInstance = dbContext.getContext();

const umzug = new Umzug({
  migrations: {
    glob: 'src/migrations/*.js',
    resolve: ({ name, path, context }) => {
      if (!path) {
        throw new Error(`Migration path is undefined for migration: ${name}`);
      }
      const migrationModule = require(path);
      return {
        name,
        up: async () => migrationModule.up(context),
        down: async () => migrationModule.down(context),
      };
    },
  },
  storage: new SequelizeStorage({ sequelize: sequelizeInstance }),
  context: sequelizeInstance.getQueryInterface(),
  logger: console,
});

export const runMigrations = async (): Promise<void> => {
  await umzug.up();
};
