import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Controller } from "@nestjs/common";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {
  Body,
  Param,
} from "@nestjs/common/decorators/http/route-params.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<[number, User[]]> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
