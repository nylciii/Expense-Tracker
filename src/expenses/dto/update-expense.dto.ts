import { PartialType } from '@nestjs/mapped-types';
import { CreateExpenseDto } from './create-expense.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}
