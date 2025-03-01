import { Sequelize } from 'sequelize';
import { initUserModel } from '../../Models/User';

export function initModels(sequelize: Sequelize): void {
  initUserModel(sequelize);
};
