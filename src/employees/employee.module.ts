import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Statement } from './entities/statement.entity';
import { Donation } from './entities/donation.entity';
import { Rate } from './entities/rate.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department, Statement, Donation, Rate])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}