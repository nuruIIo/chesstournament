// src/admin/dto/create-admin.dto.ts
import { ApiProperty } from "@nestjs/swagger";

export class CreateAdminDto {
  @ApiProperty({ example: "admin1", description: "The username of the admin" })
  username: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the admin",
  })
  password: string;
}
