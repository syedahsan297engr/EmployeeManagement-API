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
export class UpdateEmployeeDto {
  @Field()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  age: number;

  @Field()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  class: string;

  @Field(() => [String]) // Specify the type explicitly
  @IsArray()
  @IsOptional()
  subjects: string[];

  @Field()
  @IsOptional()
  @IsNumber()
  @IsOptional()
  attendance: number;
}
