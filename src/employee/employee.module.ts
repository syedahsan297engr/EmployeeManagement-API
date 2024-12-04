import { Module } from '@nestjs/common';
import { Employee } from './employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { UrlGeneratorService } from 'src/utils/pagination.util';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeeResolver, EmployeeService, UrlGeneratorService],
})
export class EmployeeModule {}
