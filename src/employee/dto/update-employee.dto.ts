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
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  age?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  class?: string;

  @Field(() => [String], { nullable: true }) // Specify the type explicitly
  @IsArray()
  @IsOptional()
  subjects?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @IsOptional()
  attendance?: number;
}
