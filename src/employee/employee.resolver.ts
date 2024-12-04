import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
//import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './employee.entity';
import { PaginatedEmployeeResponse } from './dto/employee.dto';
import { PaginationQueryDto } from '../common/pagination.dto';
import { Public } from 'src/common/public.decorator';
import { UrlExtractionInterceptor } from 'src/common/url.interceptor';
import { LoggedInUserId } from 'src/common/LoggedInUserId.decorator';
import { LoggedInUserRole } from 'src/common/LoggedInUserRole.decorator';
import { Role } from 'src/user/dto/role.enum';
import { UseInterceptors } from '@nestjs/common';
import { Message } from 'src/common/message.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

interface GraphQLRequestContext {
  urlData?: {
    baseUrl: string;
    queryParams: Record<string, any>;
    currUserId: number;
  };
}

@Resolver()
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  //Create a new employee -> only admin role user has this access
  @Mutation(() => Message)
  async createEmployee(
    @Args('createEmployeeDto') createEmployeeDto: CreateEmployeeDto,
  ): Promise<Message> {
    await this.employeeService.create(createEmployeeDto);
    return { message: 'Employee created successfully' };
  }

  @Public()
  @UseInterceptors(UrlExtractionInterceptor)
  @Query(() => PaginatedEmployeeResponse)
  async getEmployees(
    @Args('paginationQuery') paginationQuery: PaginationQueryDto,
    @Context('req') req: GraphQLRequestContext,
  ): Promise<PaginatedEmployeeResponse> {
    const { page, limit } = paginationQuery;
    const { baseUrl } = req.urlData || {
      baseUrl: '',
      queryParams: {},
    };
    return await this.employeeService.findAll(page, limit, baseUrl);
  }

  // Get a single employee by ID -> any logged in user can do this
  @Query(() => Employee, { nullable: true })
  async getEmployee(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Employee | null> {
    return await this.employeeService.findOne(id);
  }

  // Update an employee by ID -> only admin role user has this access
  @Mutation(() => Message)
  async updateEmployee(
    @Args('updateEmployeeDto') updateEmployeeDto: UpdateEmployeeDto,
    @LoggedInUserId() userId: number,
    @LoggedInUserRole() userRole: Role,
  ): Promise<Message> {
    const message = await this.employeeService.update(
      userId,
      updateEmployeeDto,
      userRole,
    );
    return { message: message };
  }
}
