export class CreateExpenseDto {
  description: string;
  amount: number;
  category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';
  type: 'income' | 'expense';
  date?: Date; // The ? means optional
}
