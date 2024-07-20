import { Controller } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "./entities/admin.entity";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import {
  Delete,
  Get,
  Post,
  Put,
} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {
  Body,
  Param,
  Res,
} from "@nestjs/common/decorators/http/route-params.decorator";
// import { Response } from 'express';

@ApiTags("admins")
@Controller("admins")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: "Create admin" })
  @ApiResponse({
    status: 201,
    description: "The admin has been successfully created.",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  @Post()
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.create(createAdminDto);
  }

  @ApiOperation({ summary: "Get all admins" })
  @ApiResponse({ status: 200, description: "Return all admins." })
  @Get()
  findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @ApiOperation({ summary: "Get admin by ID" })
  @ApiResponse({ status: 200, description: "Return admin." })
  @ApiResponse({ status: 404, description: "Not Found." })
  @Get(":id")
  findOne(@Param("id") id: number): Promise<Admin> {
    return this.adminService.findOne(id);
  }

  @ApiOperation({ summary: "Update admin" })
  @ApiResponse({
    status: 200,
    description: "The admin has been successfully updated.",
  })
  @ApiResponse({ status: 404, description: "Not Found." })
  @Put(":id")
  update(
    @Param("id") id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<{ rowsUpdated: number }> {
    return this.adminService.update(id, updateAdminDto);
  }

  @ApiOperation({ summary: "Delete admin" })
  @ApiResponse({
    status: 200,
    description: "The admin has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Not Found." })
  @Delete(":id")
  remove(@Param("id") id: number): Promise<{ rowsDeleted: number }> {
    return this.adminService.remove(id);
  }

  @ApiOperation({ summary: "Admin login" })
  @ApiResponse({ status: 201, description: "Login successful." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @Post("login")
  login(
    @Body() loginAdminDto: LoginAdminDto,
    @Res() res: Response
  ): Promise<any> {
    return this.adminService.login(loginAdminDto, res);
  }

  @ApiOperation({ summary: "Admin logout" })
  @ApiResponse({ status: 200, description: "Logout successful." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @Post("logout")
  logout(
    @Body("refreshToken") refreshToken: string,
    @Res() res: Response
  ): Promise<any> {
    return this.adminService.logout(refreshToken, res);
  }

  @ApiOperation({ summary: "Refresh token" })
  @ApiResponse({ status: 201, description: "Refresh token successful." })
  @ApiResponse({ status: 401, description: "Unauthorized." })
  @Post("refresh")
  refreshToken(
    @Body("id") id: number,
    @Body("refreshToken") refreshToken: string,
    @Res() res: Response
  ): Promise<any> {
    return this.adminService.refreshToken(id, refreshToken, res);
  }
}
