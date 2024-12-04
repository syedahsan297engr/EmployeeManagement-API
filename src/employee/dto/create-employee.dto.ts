import { Field, InputType } from '@nestjs/graphql';
import {
  IsString,
  IsInt,
  IsOptional,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

@InputType()
export class CreateEmployeeDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsInt()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  class: string;

  @Field(() => [String]) // Specify the type explicitly
  @IsArray()
  @IsOptional()
  subjects: string[];

  @Field()
  @IsNumber()
  @IsOptional()
  attendance: number;
}
