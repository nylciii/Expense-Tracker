import { AppDataSource } from './data-source';
import { Expense } from './expenses/entities/expense.entity';

async function run() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Expense);

    const samples: Omit<Expense, 'id' | 'createdAt'>[] = [
      {
        description: 'Coffee',
        amount: 3.5,
        category: 'food',
        type: 'expense',
        date: new Date(),
      },
      {
        description: 'Salary',
        amount: 2000,
        category: 'other',
        type: 'income',
        date: new Date(),
      },
      {
        description: 'Bus ticket',
        amount: 2.75,
        category: 'transport',
        type: 'expense',
        date: new Date(),
      },
    ];

    for (const sample of samples) {
      const expense = repo.create(sample);
      await repo.save(expense);
    }

    console.log('Seed complete');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

run().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
