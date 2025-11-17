import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  // Dependency Injection - NestJS gives us the service automatically
  constructor(private readonly expensesService: ExpensesService) {}

  // POST /expenses - Create new expense
  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  // GET /expenses - Get all expenses
  @Get()
  findAll() {
    return this.expensesService.findAll();
  }

  // GET /expenses/balance - Get balance summary
  @Get('balance')
  getBalance() {
    return this.expensesService.getBalance();
  }

  // GET /expenses/:id - Get one expense
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  // PATCH /expenses/:id - Update expense
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  // DELETE /expenses/:id - Delete expense
  @Delete(':id')
  remove(@Param('id') id: string) {
    this.expensesService.remove(id);
    return { message: 'Expense deleted successfully' };
  }
}
