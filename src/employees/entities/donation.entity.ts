import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Donation {

  @PrimaryColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('date')
  date: Date;

  @Column()
  currency: string;

  @ManyToOne(() => Employee, employee => employee.donations)
  @JoinColumn()
  employee: Employee;
}