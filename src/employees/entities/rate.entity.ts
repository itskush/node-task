import { Entity, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rate {
  @Index({unique: true})
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sign: string;

  @Column('decimal')
  value: number;

  @Column('date')
  date: Date;
}
