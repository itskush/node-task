import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Statement } from './entities/statement.entity';
import { Donation } from './entities/donation.entity';
import { Rate } from './entities/rate.entity';
import * as readline from 'readline';
import { Readable } from 'stream';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    @InjectRepository(Statement)
    private statementRepository: Repository<Statement>,
    @InjectRepository(Donation)
    private donationRepository: Repository<Donation>,
    @InjectRepository(Rate)
    private rateRepository: Repository<Rate>,
  ) {}

  async loadDataFromFile(file) {
    // const fileStream = fs.createReadStream('path_to_your_file.txt');
    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });
    let currentEmployee = null;
    let currentEntity = null;
    let currentEntityType = null;

    for await (const line of rl) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Employee')) {
        if (currentEmployee) {
          currentEmployee = null;
        }
        currentEntity = new Employee();
        currentEntityType = 'Employee';
      } else if (trimmedLine.startsWith('Department')) {
        currentEntity = new Department();
        currentEntityType = 'Department';
      } else if (trimmedLine.startsWith('Statement')) {
        currentEntity = new Statement();
        currentEntityType = 'Statement';
      } else if (trimmedLine.startsWith('Donation')) {
        currentEntity = new Donation();
        currentEntityType = 'Donation';
      } else if (trimmedLine.startsWith('Rate')) {
        currentEntity = new Rate();
        currentEntityType = 'Rate';
      } else if (trimmedLine.includes(':')) {
        const [key, value] = trimmedLine.split(':'); 
        if (key.trim() === 'amount' && currentEntityType === 'Donation') {
          const [amount, sign] = value.trim().split(' ');
          currentEntity['amount'] = parseFloat(amount);
          currentEntity['currency'] = sign;
        } else {
          currentEntity[key.trim()] = value.trim();
        }
      } else if (trimmedLine === '') {
        if (currentEntityType === 'Employee' && currentEntity.id) {
          currentEmployee = currentEntity;
          const existingEmployee = await this.employeeRepository.findOne({ where: { id: currentEntity.id }});
          if (!existingEmployee) {
            await this.employeeRepository.save(currentEntity);
          } else {
            await this.employeeRepository.update({ id: currentEntity.id }, currentEntity);
          }
        } else if (currentEntityType === 'Department' && currentEntity.id) {
          const existingDepartment = await this.departmentRepository.findOne({ where: { id: currentEntity.id }});
          if (!existingDepartment) {
            await this.departmentRepository.save(currentEntity);
          } else {
            await this.departmentRepository.update({ id: currentEntity.id }, currentEntity);
          }
          currentEmployee.department = currentEntity;  
          await this.employeeRepository.update({ id: currentEmployee.id }, currentEmployee);
        } else if (currentEntityType === 'Statement' && currentEntity.id) {
          const existingStatement = await this.statementRepository.findOne({ where: { id: currentEntity.id }});
          currentEntity.employee = currentEmployee;
          if (!existingStatement) {
            await this.statementRepository.save(currentEntity);
          } else {
            await this.statementRepository.update({ id: currentEntity.id }, currentEntity);
          }
        } else if (currentEntityType === 'Donation' && currentEntity.id) {
          const existingDonation = await this.donationRepository.findOne({ where: { id: currentEntity.id }});
          currentEntity.employee = currentEmployee;
          if (!existingDonation) {
            await this.donationRepository.save(currentEntity);
          } else {
            await this.donationRepository.update({ id: currentEntity.id }, currentEntity);
          }
        } else if (currentEntityType === 'Rate' && currentEntity.date) {
          const existingRate = await this.rateRepository.findOne({ where: { date: currentEntity.date }});
          if (!existingRate) {
            await this.rateRepository.save(currentEntity);
          } else {
            await this.rateRepository.update({ date: currentEntity.date }, currentEntity);
          }
        }
      }
    }
    currentEntity = null;
  }
}