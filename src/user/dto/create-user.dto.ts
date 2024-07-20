import { IsString, IsInt, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsNumber()
  rating: number;

  @IsString()
  country: string;
}
