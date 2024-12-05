import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { Employee } from './employee.entity';
import { PaginatedEmployeeResponse } from './dto/employee.dto';
import { PaginationQueryDto } from '../common/pagination.dto';
import { Public } from 'src/common/public.decorator';
import { UrlExtractionInterceptor } from 'src/common/url.interceptor';
import { Role } from 'src/user/dto/role.enum';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { Message } from 'src/common/message.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { GraphQLRequestContext } from './dto/request.dto';

@Resolver()
export class EmployeeResolver {
  constructor(private readonly employeeService: EmployeeService) {}

  //Create a new employee -> only admin role user has this access
  @Mutation(() => Message)
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async createEmployee(
    @Args('createEmployeeDto') createEmployeeDto: CreateEmployeeDto,
  ): Promise<Message> {
    await this.employeeService.create(createEmployeeDto);
    return { message: 'Employee created successfully' };
  }

  @Public() // accessible to everyone
  @UseInterceptors(UrlExtractionInterceptor)
  @Query(() => PaginatedEmployeeResponse)
  async getEmployees(
    @Args('paginationQuery') paginationQuery: PaginationQueryDto,
    @Context('req') req: GraphQLRequestContext,
  ): Promise<PaginatedEmployeeResponse> {
    const { page, limit, sortBy, sortOrder } = paginationQuery;
    const { baseUrl, queryParams } = req.urlData || {
      baseUrl: '',
      queryParams: {},
    };
    return await this.employeeService.findAll(
      page,
      limit,
      baseUrl,
      queryParams,
      sortBy,
      sortOrder,
    );
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
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async updateEmployee(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateEmployeeDto') updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Message> {
    const message = await this.employeeService.update(id, updateEmployeeDto);
    return { message: message };
  }
}

/* 
scenerios covered here
RBAC
Authenticated users access
Public access
*/
