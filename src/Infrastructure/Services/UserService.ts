import { Transaction } from 'sequelize';
import { AppDbContext } from '../Database/appDbContext';
import { User } from '../../Models/User';
import UnitOfWork from '../Database/unitOfWork';
import { Exeption } from './Exeption';

export class UserService {
  private unitOfWork: UnitOfWork;

  constructor(dbContext: AppDbContext) {
    this.unitOfWork = new UnitOfWork(dbContext);
  }

  public async updateUserBalance(userId: number, amount: number): Promise<number> {
    return await this.unitOfWork.executeInTransaction<number>(async (t: Transaction) => {
      const user = await User.findOne({
        where: { id: userId },
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      if (!user) {
        throw new Exeption(404, 'userNotFound')
      }
      const newBalance = user.balance + amount;
      if (newBalance < 0) {
        throw new Exeption(402, 'Insuficient found')
      }
      user.balance = newBalance;
      await user.save({ transaction: t });
      return user.balance;
    });
  }
}
