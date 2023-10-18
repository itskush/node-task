import { Controller, Post, UploadedFile, UseInterceptors, Get} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Rate } from './entities/rate.entity';
import { Donation } from './entities/donation.entity';

interface Reward {
  employee_id: number;
  employee_name: string;
  employee_surname: string;
  total_donation: number;
  reward: string;
}

@Controller()
export class EmployeeController {
  constructor(
    private readonly employeeService: EmployeeService,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Rate)
    private rateRepository: Repository<Rate>,
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    ) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importData(@UploadedFile() file) {
    await this.employeeService.loadDataFromFile(file);
  }
  
  @Get('get-reward')
  async calculateReward(): Promise<Reward[]> {
    const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
  queryBuilder
    .select([
      'employee.id AS employee_id',
      'employee.name AS employee_name',
      'employee.surname AS employee_surname',
      'SUM(CASE WHEN donation.amount > 100 THEN donation.amount ELSE 0 END) AS total_donation',
    ])
    .addSelect(`CASE WHEN SUM(CASE WHEN donation.amount > 100 THEN donation.amount ELSE 0 END) > 100 THEN CONCAT(ROUND((SUM(CASE WHEN donation.amount > 100 THEN donation.amount ELSE 0 END) / (SELECT SUM(CASE WHEN donation.amount > 100 THEN donation.amount ELSE 0 END) FROM donation WHERE employee.id = employee.id)) * 10000, 2)::text, ' ', (SELECT rate.sign FROM rate JOIN donation ON rate.sign = donation.currency WHERE donation.employee.id = employee.id ORDER BY rate.date DESC LIMIT 1)) ELSE '0' END`, 'reward')
    .leftJoin('employee.donations', 'donation')
    .groupBy('employee.id, employee.name, employee.surname');


    const results = await queryBuilder.getRawMany();

    for (const result of results) {
      result.reward = parseFloat(result.reward).toFixed(2);
    }
    
    return results;
  }
}