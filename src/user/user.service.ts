import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common/exceptions/unauthorized.exception";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    private readonly jwtService: JwtService
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new User({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll<User>();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findByPk<User>(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<[number, User[]]> {
    const [numberOfAffectedRows, [updatedUser]] =
      await this.userRepository.update(
        { ...updateUserDto },
        { where: { id }, returning: true }
      );
    if (!numberOfAffectedRows) {
      throw new NotFoundException("User not found");
    }
    return [numberOfAffectedRows, [updatedUser]];
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    await user.destroy();
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { username, password } = loginUserDto;
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.jwtService.sign({ userId: user.id });
  }
}
