import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './employees/employee.module';
import { Employee } from './employees/entities/employee.entity';
import { Department } from './employees/entities/department.entity';
import { Statement } from './employees/entities/statement.entity';
import { Donation } from './employees/entities/donation.entity';
import { Rate } from './employees/entities/rate.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        entities: [Employee,Department,Statement,Donation, Rate],
      }),
      inject: [ConfigService],
    }),
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
