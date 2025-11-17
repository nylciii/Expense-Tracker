import { DataSource } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'expense_tracker',
  entities: [Expense],
});

async function seed() {
  // Connect to database
  await AppDataSource.initialize();

  const expenseRepository = AppDataSource.getRepository(Expense);

  // Clear existing data (optional)
  await expenseRepository.clear();

  // Create sample expenses
  const sampleExpenses = [
    {
      description: 'Coffee at Starbucks',
      amount: 5.5,
      category: 'food' as const,
      type: 'expense' as const,
      date: new Date('2025-11-10'),
    },
    {
      description: 'Uber to office',
      amount: 12.0,
      category: 'transport' as const,
      type: 'expense' as const,
      date: new Date('2025-11-11'),
    },
    {
      description: 'Movie tickets',
      amount: 20.0,
      category: 'entertainment' as const,
      type: 'expense' as const,
      date: new Date('2025-11-12'),
    },
    {
      description: 'Freelance project payment',
      amount: 500.0,
      category: 'other' as const,
      type: 'income' as const,
      date: new Date('2025-11-11'),
    },
    {
      description: 'Electricity bill',
      amount: 85.0,
      category: 'utilities' as const,
      type: 'expense' as const,
      date: new Date('2025-11-09'),
    },
  ];

  // Save all expenses to database
  for (const expense of sampleExpenses) {
    const newExpense = expenseRepository.create(expense);
    await expenseRepository.save(newExpense);
  }

  console.log('✅ Seeded 5 sample expenses!');

  // Close connection
  await AppDataSource.destroy();
}

// Run the seed
seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
