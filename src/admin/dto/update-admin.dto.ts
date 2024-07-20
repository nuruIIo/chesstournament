import { ApiProperty } from "@nestjs/swagger";

export class UpdateAdminDto {
  @ApiProperty({ example: "admin1", description: "The username of the admin" })
  username?: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the admin",
  })
  password?: string;
}
