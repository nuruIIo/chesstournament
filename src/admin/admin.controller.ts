import { Controller } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Admin } from "./entities/admin.entity";
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
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

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
  create(@Body() adminDto: CreateAdminDto): Promise<Admin> {
    return this.adminService.createAdmin(adminDto);
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
    @Body() adminDto: UpdateAdminDto
  ): Promise<[number, Admin[]]> {
    return this.adminService.updateAdmin(id, adminDto);
  }

  @ApiOperation({ summary: "Delete admin" })
  @ApiResponse({
    status: 200,
    description: "The admin has been successfully deleted.",
  })
  @ApiResponse({ status: 404, description: "Not Found." })
  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.adminService.deleteAdmin(id);
  }
}
