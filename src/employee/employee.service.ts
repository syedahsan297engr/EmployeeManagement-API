import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindManyOptions } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import {
  PaginatedEmployeeResponse,
  EmployeeResponse,
} from './dto/employee.dto';
import { UrlGeneratorService } from 'src/utils/pagination.util';
import paginationConfig from 'src/utils/pagination.config';
import { Role } from 'src/user/dto/role.enum';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly urlGeneratorService: UrlGeneratorService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    try {
      const employee = this.employeeRepository.create(createEmployeeDto);
      return await this.employeeRepository.save(employee);
    } catch (error) {
      throw new ConflictException('Failed to create employee');
    }
  }

  async findAll(
    page: number = paginationConfig.defaultPage,
    limit: number = paginationConfig.defaultLimit,
    baseUrl: string,
  ): Promise<PaginatedEmployeeResponse> {
    const options: FindManyOptions<Employee> = {
      take: limit,
      skip: (page - 1) * limit,
    };

    const [employees, total] =
      await this.employeeRepository.findAndCount(options);

    const formattedEmployees: EmployeeResponse[] = employees.map(
      (employee) => ({
        id: employee.id,
        name: employee.name,
        age: employee.age,
        class: employee.class,
        subjects: employee.subjects,
        attendance: employee.attendance,
      }),
    );

    const totalPages = Math.ceil(total / limit);
    const nextPage = page < totalPages ? page + 1 : null;

    return {
      employees: formattedEmployees,
      total,
      page,
      pageSize: limit,
      nextPage: this.urlGeneratorService.generateNextPageUrl2(
        nextPage,
        limit,
        baseUrl,
        {},
      ),
    };
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
    userRole: Role,
  ): Promise<string> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (userRole !== Role.ADMIN) {
      return 'You do not have permission to update employee';
    }

    Object.assign(employee, updateEmployeeDto);
    await this.employeeRepository.save(employee);

    return 'Employee updated successfully';
  }
}
