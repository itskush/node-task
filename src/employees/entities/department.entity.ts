import { Entity, Column, PrimaryColumn, OneToMany, Index } from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class Department {
  @Index({unique: true})
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employee: Employee;

}