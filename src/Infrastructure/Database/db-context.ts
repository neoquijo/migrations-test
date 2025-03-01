import { AsyncLocalStorage } from 'async_hooks';
import { Options, Sequelize } from 'sequelize';
import { Logger } from 'winston';


export abstract class DbContext implements Disposable {
  protected sequelize: Sequelize;
  private disposed: boolean = false;
  protected logger: Logger;
  private asyncLocalStorage: AsyncLocalStorage<Sequelize>; // Потокобезопасность: Использование AsyncLocalStorage обеспечивает изоляцию соединений для каждого потока выполнения.

  protected constructor(dbOptions: Options, logger: Logger) {
    this.logger = logger;
    try {
      this.sequelize = new Sequelize(dbOptions);
      this.asyncLocalStorage = new AsyncLocalStorage<Sequelize>();
      this.logger.info("DbContext created");
    } catch (error) {
      this.logger.error(`Error creating DbContext: ${error}`);
      throw error;
    }
  }



  public async disconnect(): Promise<void> {
    if (!this.disposed) {
      try {
        await this.sequelize.close();
        this.disposed = true; // Устанавливаем флаг disposed в true
        this.logger.info('Disconnected from database');
      } catch (error) {
        this.logger.error(`Error disconnecting from database: ${error}`);
        throw error;
      }
    }
  }

  public async executeQuery<T>(
    query: (prisma: Sequelize) => Promise<T>
  ): Promise<T> {
    if (!this.disposed) {
      return this.asyncLocalStorage.run(this.sequelize, async () => {
        try {
          const sequelize = this.asyncLocalStorage.getStore();
          if (!sequelize) {
            throw new Error('Sequelize instance not found in AsyncLocalStorage');
          }
          return await query(sequelize);
        } catch (error) {
          this.logger.error(`Error executing query: ${error}`);
          throw error;
        }
      });
    }
    throw new Error('DbContext has been disposed');
  }

  public getContext(): Sequelize {
    if (this.disposed) {
      throw new Error('DbContext has been disposed');
    }
    const sequelize = this.sequelize;
    if (!sequelize) {
      throw new Error('Sequelize instance not found in AsyncLocalStorage');
    }
    return sequelize;
  }

  public isDisposed(): boolean {
    return this.disposed;
  }

  public async [Symbol.dispose](): Promise<void> {
    if (!this.disposed) {
      try {
        await this.sequelize.close();
        this.logger.info('Disconnected from database');
        this.disposed = true;
      } catch (error) {
        this.logger.error(`Error disconnecting from database: ${error}`);
        throw error;
      }
    }
  }
}