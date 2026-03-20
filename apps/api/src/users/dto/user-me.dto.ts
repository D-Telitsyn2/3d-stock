import { ApiProperty } from '@nestjs/swagger';

export class UserMeDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ description: 'Clerk user id' })
  externalId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ required: false, nullable: true })
  firstName!: string | null;

  @ApiProperty({ required: false, nullable: true })
  lastName!: string | null;

  @ApiProperty({ enum: ['USER', 'SELLER', 'ADMIN'] })
  role!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
