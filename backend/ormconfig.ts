import { DataSource } from 'typeorm';
import { Expense } from './src/expenses/entities/expense.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'expense_tracker',
  entities: [Expense],
  migrations: ['src/migrations/**/*.ts'],
  synchronize: false,
});
