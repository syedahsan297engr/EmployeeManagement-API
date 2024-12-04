import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class EmployeeResponse {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => String)
  class: string;

  @Field(() => [String])
  subjects: string[];

  @Field(() => Float)
  attendance: number;
}

@ObjectType()
export class PaginatedEmployeeResponse {
  @Field(() => Boolean, { nullable: true })
  success?: boolean;

  @Field(() => [EmployeeResponse])
  employees: EmployeeResponse[];

  @Field(() => Int)
  total: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field(() => String, { nullable: true })
  nextPage?: string | null;
}
