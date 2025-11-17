import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
  ) {}

  // CREATE - Add a new expense
  create(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      category: createExpenseDto.category || 'other',
      type: createExpenseDto.type || 'expense',
    });
    return this.expenseRepository.save(expense);
  }

  // READ ALL - Get all expenses
  findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({ order: { createdAt: 'DESC' } });
  }

  // READ ONE - Get a specific expense by ID
  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({ where: { id } });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  // UPDATE - Modify an existing expense
  async update(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    const expense = await this.findOne(id); // Verify exists first
    Object.assign(expense, updateExpenseDto);
    return this.expenseRepository.save(expense);
  }

  // DELETE - Remove an expense
  async remove(id: string): Promise<void> {
    const expense = await this.findOne(id); // Verify exists first
    await this.expenseRepository.remove(expense);
  }

  // BONUS - Calculate balance
  async getBalance(): Promise<{
    total: number;
    income: number;
    expenses: number;
  }> {
    const allExpenses = await this.expenseRepository.find();

    const income = allExpenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + parseFloat(String(exp.amount)), 0);

    const expensesTotal = allExpenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + parseFloat(String(exp.amount)), 0);

    return {
      total: income - expensesTotal,
      income,
      expenses: expensesTotal,
    };
  }
}
