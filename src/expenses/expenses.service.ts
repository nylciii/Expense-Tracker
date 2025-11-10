import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';

@Injectable()
export class ExpensesService {
  // This is our "database" for now - just an array in memory
  private expenses: Expense[] = [];
  private idCounter = 1;

  // CREATE - Add a new expense
  create(createExpenseDto: CreateExpenseDto): Expense {
    const newExpense: Expense = {
      id: String(this.idCounter++),
      ...createExpenseDto, // Spread operator - copies all properties
      date: createExpenseDto.date || new Date(), // Use provided date or today
      createdAt: new Date(),
    };

    this.expenses.push(newExpense);
    return newExpense;
  }

  // READ ALL - Get all expenses
  findAll(): Expense[] {
    return this.expenses;
  }

  // READ ONE - Get a specific expense by ID
  findOne(id: string): Expense {
    const expense = this.expenses.find((exp) => exp.id === id);

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  // UPDATE - Modify an existing expense
  update(id: string, updateExpenseDto: UpdateExpenseDto): Expense {
    const expenseIndex = this.expenses.findIndex((exp) => exp.id === id);

    if (expenseIndex === -1) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    // Merge old expense with new data
    const updatedExpense = {
      ...this.expenses[expenseIndex],
      ...updateExpenseDto,
    };

    this.expenses[expenseIndex] = updatedExpense;
    return updatedExpense;
  }

  // DELETE - Remove an expense
  remove(id: string): void {
    const expenseIndex = this.expenses.findIndex((exp) => exp.id === id);

    if (expenseIndex === -1) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    this.expenses.splice(expenseIndex, 1);
  }

  // BONUS - Calculate balance
  getBalance(): { total: number; income: number; expenses: number } {
    const income = this.expenses
      .filter((exp) => exp.type === 'income')
      .reduce((sum, exp) => sum + exp.amount, 0);

    const expensesTotal = this.expenses
      .filter((exp) => exp.type === 'expense')
      .reduce((sum, exp) => sum + exp.amount, 0);

    return {
      total: income - expensesTotal,
      income,
      expenses: expensesTotal,
    };
  }
}
