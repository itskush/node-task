import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne, Index, JoinColumn } from 'typeorm';
import { Department } from './department.entity';
import { Statement } from './statement.entity';
import { Donation } from './donation.entity';

@Entity()
export class Employee {
  @Index({unique: true})
  @PrimaryColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  surname: string;

  @ManyToOne(() => Department)
  @JoinColumn()
  department: Department;

  @OneToMany(() => Statement, statement => statement.employee)
  statements: Statement[];

  @OneToMany(() => Donation, donation => donation.employee)
  donations: Donation[];
}