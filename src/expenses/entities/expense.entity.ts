import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['food', 'transport', 'entertainment', 'utilities', 'other'],
  })
  category: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';

  @Column({ type: 'enum', enum: ['income', 'expense'] })
  type: 'income' | 'expense';

  @Column({ type: 'date', nullable: true })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;
}
