import { Entity, Column, PrimaryColumn, ManyToOne, Index } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Statement {
  @Index({unique: true})
  @PrimaryColumn()
  id: number;

  @Column('decimal')
  amount: number;

  @Column('date')
  date: Date;

  @ManyToOne(() => Employee, employee => employee.statements)
  employee: Employee;
}
