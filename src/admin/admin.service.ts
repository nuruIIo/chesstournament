import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Admin } from "./entities/admin.entity";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Response } from "supertest";
// import { Response } from "express";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin) private readonly adminRepo: typeof Admin,
    private readonly jwtService: JwtService
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const { password } = createAdminDto;
      const hashed_password = await bcrypt.hash(password, 7);

      return await this.adminRepo.create({
        ...createAdminDto,
        password: hashed_password,
      });
    } catch (error) {
      // Handle database errors
      throw new Error("Failed to create admin.");
    }
  }

  async findAll() {
    try {
      return await this.adminRepo.findAll();
    } catch (error) {
      // Handle database errors
      throw new Error("Failed to retrieve admins.");
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.adminRepo.findByPk(id);
      if (!admin) {
        throw new NotFoundException("Admin not found.");
      }
      return admin;
    } catch (error) {
      // Handle database errors
      throw new Error("Failed to retrieve admin.");
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const [rowsUpdated] = await this.adminRepo.update(updateAdminDto, {
        where: { id },
      });
      if (!rowsUpdated) {
        throw new NotFoundException("Admin not found.");
      }
      return { rowsUpdated };
    } catch (error) {
      // Handle database errors
      throw new Error("Failed to update admin.");
    }
  }

  async remove(id: number) {
    try {
      const rowsDeleted = await this.adminRepo.destroy({ where: { id } });
      if (!rowsDeleted) {
        throw new NotFoundException("Admin not found.");
      }
      return { rowsDeleted };
    } catch (error) {
      // Handle database errors
      throw new Error("Failed to delete admin.");
    }
  }

  async getTokens(admin: Admin) {
    const payload = {
      id: admin.id,
      role: "admin",
    };

    // Generate access and refresh tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginAdminDto: LoginAdminDto, res: Response) {
    try {
      const { username, password } = loginAdminDto;
      const admin = await this.adminRepo.findOne({ where: { username } });
      if (!admin) {
        throw new BadRequestException("admin not found");
      }

      const checkPass = await bcrypt.compare(password, admin.password);
      if (!checkPass) {
        throw new BadRequestException("wrong username or password");
      }

      const tokens = await this.getTokens(admin);
      const token = await bcrypt.hash(tokens.refreshToken, 7);

      await this.adminRepo.update(
        { token },
        { where: { id: admin.id }, returning: true }
      );

      res.cookie("token", tokens.refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      const response = {
        message: "Admin logged",
        admin,
        tokens,
      };

      return response;
    } catch (error) {
      throw new Error("Failed to login admin");
    }
  }

  async logout(refreshToken: string, res: Response) {
    // Verify refresh token
    const admindata = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!admindata) throw new ForbiddenException("Token not found");

    // Clear refresh token
    await this.adminRepo.update(
      { token: null },
      { where: { id: admindata.id }, returning: true }
    );
    res.clearCookie("token");

    // Prepare response
    const response = {
      message: "Admin logged Out successfully",
    };
    return response;
  }

  async refreshToken(id: number, refreshToken: string, res: Response) {
    // Decode refresh token
    const decodedToken = await this.jwtService.decode(refreshToken);
    if (id !== decodedToken["id"]) {
      throw new BadRequestException("Admin not matched");
    }
    const admin = await this.adminRepo.findByPk(id);
    if (!admin || !admin.token) {
      throw new BadRequestException("Refresh token not found");
    }

    // Compare refresh token hash
    const isMatchedtoken = await bcrypt.compare(refreshToken, admin.token);
    if (!isMatchedtoken) throw new ForbiddenException("Forbidden");

    // Generate new tokens and refresh token hash
    const tokens = await this.getTokens(admin);
    const token = await bcrypt.hash(tokens.refreshToken, 7);

    // Update admin with new refresh token
    await this.adminRepo.update(
      { token },
      { where: { id: admin.id }, returning: true }
    );

    // Set refresh token cookie
    res.cookie("token", tokens.refreshToken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // Prepare response
    const response = {
      message: "Admin refreshed",
      user: admin,
      tokens,
    };
    return response;
  }
}
