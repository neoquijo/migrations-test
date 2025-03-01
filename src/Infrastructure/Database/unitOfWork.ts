import { Transaction } from 'sequelize';
import { DbContext } from './db-context';

class UnitOfWork {
  private dbContext: DbContext;
  private transaction: Transaction | null = null;

  constructor(dbContext: DbContext) {
    this.dbContext = dbContext;
  }

  public async beginTransaction(): Promise<void> {
    if (this.transaction) {
      throw new Error("Transaction already in progress");
    }
    this.transaction = await this.dbContext.getContext().transaction();
  }

  public async commitTransaction(): Promise<void> {
    if (!this.transaction) {
      throw new Error("No active transaction");
    }
    await this.transaction.commit();
    this.transaction = null;
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this.transaction) {
      throw new Error("No active transaction");
    }
    await this.transaction.rollback();
    this.transaction = null;
  }

  public async executeInTransaction<T>(work: (t: Transaction) => Promise<T>): Promise<T> {
    if (this.transaction) {
      return work(this.transaction);
    } else {
      return await this.dbContext.executeQuery(async (sequelize) => {
        return await sequelize.transaction(async (t) => work(t));
      });
    }
  }

  public getTransaction(): Transaction | null {
    return this.transaction;
  }
}

export default UnitOfWork