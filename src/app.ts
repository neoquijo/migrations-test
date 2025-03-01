import express from 'express';
import bodyParser from 'body-parser';
import { AppDbContext } from './Infrastructure/Database/appDbContext';
import { UserService } from './Infrastructure/Services/UserService';
import { Exeption } from './Infrastructure/Services/Exeption';

export const createApp = (dbContext: AppDbContext) => {
  const app = express();
  app.use(bodyParser.json());

  const userService = new UserService(dbContext);

  app.post('/users/update-balance', async (req, res) => {
    const { userId, amount } = req.body;
    if (typeof userId !== 'number' || typeof amount !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    try {
      const balance = await userService.updateUserBalance(userId, amount);
      res.json({ balance });
    } catch (error: unknown) {
      if (error instanceof Exeption)
        res.status(error.code).json({ error: error.message });
    }
  });

  return app;
}
